export function Markdown({ html }: { html: string }) {
  return <div className="prose-docs" dangerouslySetInnerHTML={{ __html: html }} />;
}
