import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveDeliveryInfo } from "../../slices/cartSlice";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "./checkoutStep";
import { toast } from "react-toastify";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

// Manually defined list of areas in Colombo
const colomboAreas = [
  "Fort - Colombo 01",
  "Slave Island - Colombo 02",
  "Kollupitiya - Colombo 03",
  "Bambalapitiya - Colombo 04",
  "Havelock Town - Colombo 05",
  "Wellawatte - Colombo 06",
  "Cinnamon Gardens - Colombo 07",
  "Borella - Colombo 08",
  "Dematagoda - Colombo 09",
  "Maradana - Colombo 10",
  "Pettah - Colombo 11",
  "Hulftsdorp - Colombo 12",
  "Kotahena - Colombo 13",
  "Grandpass - Colombo 14",
  "Mutwal - Colombo 15",
  "Nugegoda",
  "Rajagiriya",
  "Battaramulla",
  "Maharagama",
  "Kotte",
  "Dehiwala",
  "Mount Lavinia",
  "Moratuwa"
];

// Yup validation schema
const validationSchema = Yup.object({
  address: Yup.string().required("Address is required"),
  city: Yup.string().required("City is required"),
  phoneNo: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
});

const DeliveryInfo = () => {
  const { deliveryInfo = {} } = useSelector((state) => state.cartState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orderInfo = sessionStorage.getItem('orderInfo');

  const initialValues = {
    address: deliveryInfo.address || "",
    city: deliveryInfo.city || "",
    phoneNo: deliveryInfo.phoneNo || "",
  };

  const handleSubmit = (values) => {
    dispatch(saveDeliveryInfo(values));
    navigate("/order/confirm");
  };

  return (
    <Fragment>
      <CheckoutSteps
        delivery={true}
        confirmOrder={false}
        payment={false}
      />
      <div className="flex justify-center items-center py-10">
        <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-md">
          <h1 className="text-2xl font-semibold mb-6 text-gray-800">Delivery Info</h1>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form>
                {/* Address */}
                <div className="mb-4">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <Field
                    name="address"
                    type="text"
                    className={`w-full border rounded px-3 py-2 ${
                      errors.address && touched.address ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  <ErrorMessage name="address" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* City */}
                <div className="mb-4">
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <Field
                    as="select"
                    name="city"
                    className={`w-full border rounded px-3 py-2 ${
                      errors.city && touched.city ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="">Select City</option>
                    {colomboAreas.map((area, i) => (
                      <option key={i} value={area}>
                        {area}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="city" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Phone Number */}
                <div className="mb-4">
                  <label htmlFor="phoneNo" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone No
                  </label>
                  <Field
                    name="phoneNo"
                    type="tel"
                    className={`w-full border rounded px-3 py-2 ${
                      errors.phoneNo && touched.phoneNo ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    
                  />
                  <ErrorMessage name="phoneNo" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded"
                >
                  CONTINUE
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </Fragment>
  );
};

export default DeliveryInfo;

