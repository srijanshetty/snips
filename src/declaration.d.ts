declare module 'front-matter' {
  interface FrontmatterData {
    body: string;
    attributes: {
      tags: string[];
      language: string;
    };
  }

  function frontmatter(data: string): FrontmatterData;

  export default frontmatter;
}
