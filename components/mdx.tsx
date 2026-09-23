import defaultMdxComponents from 'fumadocs-ui/mdx';
import { TypeTable } from 'fumadocs-ui/components/type-table';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { File, Files, Folder } from 'fumadocs-ui/components/files';
import { Mermaid } from '@/components/mermaid';
import type { MDXComponents } from 'mdx/types';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    TypeTable,
    Tabs,
    Tab,
    Files,
    Folder,
    File,
    Mermaid,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
