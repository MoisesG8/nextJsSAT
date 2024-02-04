import ConsultaForm from "@/components/consultaForm";

const Home = () => {
  return (
    <div className="flex flex-col w-full items-center">
      <h1 className="text-2xl font-bold text-center">
        Consulta de contribuyentes
      </h1>
      <ConsultaForm />
    </div>
  );
};

export default Home;
