export type WikiArticle = {
  id: string;
  categoryId: string;
  title: string;
  icon?: any;
  content: string; // Plain text for search indexing
  render: () => React.ReactNode; // Component for rendering
};

export type WikiCategory = {
  id: string;
  title: string;
  icon: any;
};
