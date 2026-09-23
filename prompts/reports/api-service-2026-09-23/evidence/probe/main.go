// Автор: GPT-6 Astra Pro, 2026-09-23. Написано агентом, не человеком. Проверяйте выводы.
package main
import (
 "context"
 "encoding/json"
 "fmt"
 "os"
 "github.com/easyp-tech/service/internal/config"
 "github.com/easyp-tech/service/internal/api"
 "github.com/easyp-tech/service/internal/core"
 "google.golang.org/grpc/codes"
 "google.golang.org/grpc/status"
)
func main() {
 cfg, err := config.Defaults(context.Background()); if err != nil { panic(err) }
 leaves, err := config.Leaves(); if err != nil { panic(err) }
 rows := make([]map[string]any,0,len(leaves))
 for _,l := range leaves { rows=append(rows,map[string]any{"yaml":l.Name(),"env":l.EnvKey,"type":l.Value(cfg).Type().String(),"default":fmt.Sprint(l.Value(cfg).Interface()),"tag_default":l.Default,"has_default":l.HasDefault,"secret":l.Secret}) }
 b,err:=json.MarshalIndent(rows,"","  "); if err!=nil {panic(err)}; if err=os.WriteFile("../configuration-leaves.json",b,0600);err!=nil{panic(err)}
 fmt.Printf("config leaves=%d\n",len(rows))
 for _,tc:=range []struct{name string;err error}{
  {"handler InvalidArgument",status.Error(codes.InvalidArgument,"bad page token")},
  {"plugin deadline wrapped",fmt.Errorf("%w: %w",core.ErrGenerationFailed,context.DeadlineExceeded)},
  {"bare deadline",context.DeadlineExceeded},
  {"overloaded",core.ErrServerOverloaded},
 } { s:=api.ErrorToStatus(tc.err);fmt.Printf("%s => %s; details=%v\n",tc.name,s.Code(),s.Details()) }
}
