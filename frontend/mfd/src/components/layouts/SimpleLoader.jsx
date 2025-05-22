import { Triangle } from "react-loader-spinner";

const SimpleLoader = () => {
  return (
    <div className="fixed inset-0  z-50 flex items-center justify-center pointer-events-none">
      <Triangle
        visible={true}
        height="200"
        width="200"
        color="#00ffcc" 
        ariaLabel="triangle-loading"
      />
    </div>
  );
};

export default SimpleLoader;

