type PageAppProps = {
  message: string;
};

const PageApp = ({ message }: PageAppProps) => {
  return (
    <div style={{ padding: "2rem", backgroundColor: "#f0f0f0" }}>
      <p style={{ color: "purple", fontWeight: "bold" }}>{message}</p>
    </div>
  );
};

export default PageApp;
