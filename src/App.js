import ContentRenderer from "./components/ContentRenderer";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <ContentRenderer url="https://app-conteudodoc-cms-qa.azurewebsites.net/wp-json/api/elementor-content?post_id=29486" />
    </div>
  );
}
