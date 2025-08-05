import {
  FaShoppingCart,
  FaShippingFast,
  FaMoneyCheckAlt,
} from "react-icons/fa";

function Stepper({ currentStep = 0 }) {
  // Array of steps for easy mapping
  const STEPS = [
    { icon: <FaShoppingCart />, label: "My Cart" },
    { icon: <FaShippingFast />, label: "Checkout" },
    { icon: <FaMoneyCheckAlt />, label: "Payment" },
  ];
  return (
    <div className="flex items-center justify-center w-full gap-0 my-7 px-3">
      {STEPS.map((step, idx) => (
        <div
          key={step.label}
          className={`flex items-center ${
            idx < STEPS.length - 1 ? "flex-1" : ""
          }`}
        >
          {/* Step icon + label */}
          <div className="flex flex-col items-center z-10">
            <div
              className={`
                rounded-full p-2 border-4
                ${
                  idx < currentStep
                    ? "bg-[#1d8599] text-white border-[#1d8599]"
                    : idx === currentStep
                    ? "bg-white text-[#1d8599] border-[#1d8599] shadow-lg"
                    : "bg-gray-200 text-gray-400 border-gray-300"
                }`}
              style={{
                fontSize: "2rem",
                width: 48,
                height: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {step.icon}
            </div>
            <span
              className={`mt-2 font-bold text-base tracking-wide
              ${idx === currentStep ? "text-[#1d8599]" : "text-gray-500"}`}
            >
              {step.label}
            </span>
          </div>
          {/* Connector to next step */}
          {idx < STEPS.length - 1 && (
            <div className="flex-1 h-1">
              <div
                className={`
                  h-1 mt-0.5 rounded
                  ${idx < currentStep ? "bg-[#1d8599]" : "bg-gray-200"}
                `}
                style={{ width: "100%", minWidth: 32 }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Stepper;
