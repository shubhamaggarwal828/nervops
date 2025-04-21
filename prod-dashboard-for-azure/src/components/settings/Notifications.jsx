// import { useState, useEffect } from "react";
// import SettingSection from "./SettingSection";
// import { Bell } from "lucide-react";
// import  crypto from "crypto";
// import CryptoJS from "crypto-js";



// const Notifications = () => {
//   const [formData, setFormData] = useState({
//     tenantId: "",
//     clientId: "",
//     clientSecret: "",
// 	azureEmail: "",
// 	subscriptionId: "",
//   });

//   const [loading, setLoading] = useState(false);

//   const fetchApiUrl = import.meta.env.VITE_AZURE_DETAILS_FETCH_API_URL;
//   const storeApiUrl = import.meta.env.VITE_AZURE_DETAILS_STORE_API_URL;
// // Fetch existing data from the backend

// const algorithm = import.meta.env.VITE_CRYPTO_ALGORITHM;
// const key = import.meta.env.VITE_CRYPTO_KEY;
// const iv = import.meta.env.VITE_CRYPTO_IV;

// useEffect(() => {
// 	const fetchData = async () => {
// 	  try {
// 		setLoading(true);
// 		const response = await fetch(fetchApiUrl, {
// 		  method: "GET",
// 		  credentials: "include",
// 		  headers: {
// 			"Content-Type": "application/json",
// 		  },
// 		});
  
// 		if (!response.ok) throw new Error("Failed to fetch data");
  
// 		const data = await response.json();  
// 		// Check if azureAccounts exists and has at least one item
// 		if (data.azureAccounts && data.azureAccounts.length > 0) {
// 		  const account = data.azureAccounts[0]; // Access the first account
// 		  setFormData({
// 			tenantId: account.tenantId || "",
// 			clientId: account.clientId || "",
// 			clientSecret: account.clientSecret || "",
// 			subscriptionId: account.subscriptionId || "", // Optional
// 			azureEmail: account.azureEmail || "", // Optional
// 		  });
// 		} else {
// 		  console.warn("No Azure accounts found");
// 		  setFormData({
// 			tenantId: "",
// 			clientId: "",
// 			clientSecret: "",
// 			subscriptionId: "",
// 			azureEmail: "",
// 		  });
// 		}
// 	  } catch (error) {
// 		console.error("Error fetching Azure details:", error);
// 	  } finally {
// 		setLoading(false);
// 	  }
// 	};
  
// 	fetchData();
//   }, [fetchApiUrl]);
  

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//   };

//   function encryptData(data) {
// 	// Convert the data to a JSON string (if not already a string)
// 	const plaintext = JSON.stringify(data);
// 	// Parse key and IV from hex strings
// 	const keyHex = CryptoJS.enc.Hex.parse(key);
// 	const ivHex = CryptoJS.enc.Hex.parse(iv);
// 	// Encrypt using AES in CBC mode with PKCS7 padding
// 	const encrypted = CryptoJS.AES.encrypt(plaintext, keyHex, {
// 	  iv: ivHex,
// 	  mode: CryptoJS.mode.CBC,
// 	  padding: CryptoJS.pad.Pkcs7,
// 	});
// 	// Convert the ciphertext to a hex string to match the backend's expected format
// 	return encrypted.ciphertext.toString(CryptoJS.enc.Hex);
//   }
  


//   // Submit data to the backend
// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     try {
// // 		formData.tenantId = encryptData(formData.tenantId);
// // 		formData.clientId = encryptData(formData.clientId);
// // 		formData.clientSecret = encryptData(formData.clientSecret);
// // 		console.log(formData);
// //       const response = await fetch(storeApiUrl, {
// //         method: "POST",
// // 		credentials: "include",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify(formData),
// //       });
// //       const result = await response.json();
// //       alert(result.message);
// //     } catch (error) {
// //       console.error("Error storing Azure details:", error);
// //     }
// //   };

// const handleSubmit = async (e) => {
// 	e.preventDefault();
// 	try {
// 	  // Encrypt each field using the updated encryptData function
// 	  const encryptedTenantId = encryptData(formData.tenantId);
// 	  const encryptedClientId = encryptData(formData.clientId);
// 	  const encryptedClientSecret = encryptData(formData.clientSecret);
  
// 	  // Prepare an object with the encrypted values
// 	  const encryptedData = {
// 		tenantId: encryptedTenantId,
// 		clientId: encryptedClientId,
// 		clientSecret: encryptedClientSecret,
// 		azureEmail: formData.azureEmail, 
// 		subscriptionId: formData.subscriptionId,
// 		// Include any other fields as needed (e.g., subscriptionId or azureEmail)
// 	  };
  
// 	  console.log("Encrypted Data:", encryptedData);
	  
// 	  const response = await fetch(storeApiUrl, {
// 		method: "POST",
// 		credentials: "include",
// 		headers: {
// 		  "Content-Type": "application/json",
// 		},
// 		body: JSON.stringify(encryptedData),
// 	  });
	  
// 	  const result = await response.json();
// 	  alert(result.message);
// 	} catch (error) {
// 	  console.error("Error storing Azure details:", error);
// 	}
//   };
  

//   return (
//     <SettingSection icon={Bell} title={"Connect Your Azure Account"}>
//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <form
//           className="max-w-full pl-10 pr-10 mx-auto"
//           onSubmit={handleSubmit}
//         >
// 		 <div className="relative z-0 w-full mb-5 group">
//             <input
//               name="azureEmail"
// 			  type="email"
//               value={formData.azureEmail}
//               onChange={handleChange}
//               className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
//               placeholder=" "
//               required
//             />
//             <label
//               htmlFor="azureEmail"
//               className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
//             >
//               Enter Your Azure Email ID
//             </label>
//           </div>
//           <div className="relative z-0 w-full mb-5 group">
//             <input
//               name="tenantId"
//               value={formData.tenantId}
//               onChange={handleChange}
//               className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
//               placeholder=" "
//               required
//             />
//             <label
//               htmlFor="tenantId"
//               className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
//             >
//               Enter Your Azure Tenant ID
//             </label>
//           </div>

//           <div className="relative z-0 w-full mb-5 group">
//             <input
//               type="text"
//               name="clientId"
//               value={formData.clientId}
//               onChange={handleChange}
//               className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
//               placeholder=" "
//               required
//             />
//             <label
//               htmlFor="clientId"
//               className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
//             >
//               Enter Your Azure Client ID
//             </label>
//           </div>

//           <div className="relative z-0 w-full mb-5 group">
//             <input
//               type="password"
//               name="clientSecret"
//               value={formData.clientSecret}
//               onChange={handleChange}
//               className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
//               placeholder=" "
//               autoComplete="current-password"
//               required
//             />
//             <label
//               htmlFor="clientSecret"
//               className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
//             >
//               Enter Your Azure Client Secret
//             </label>
//           </div>
// 		  <div className="relative z-0 w-full mb-5 group">
//             <input
//               name="subscriptionId"
//               value={formData.subscriptionId}
//               onChange={handleChange}
//               className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
//               placeholder=" "
//               required
//             />
//             <label
//               htmlFor="subscriptionId"
//               className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
//             >
//               Enter Your Azure Subscription ID
//             </label>
//           </div>

//           {/* <div className="mt-4 pt-8">
//             <button
//               type="submit"
//               className="bg-indigo-600 pl-8 pr-8 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200"
//             >
//               Connect Your Account
//             </button>
//           </div> */}
// 		  <div className="mt-4 pt-8">
//   {formData.tenantId ? (
//     <button
//       type="submit"
//       className="bg-indigo-600 pl-8 pr-8 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200"
//     >
//       Update Your Account
//     </button>
//   ) : (
//     <button
//       type="submit"
//       className="bg-indigo-600 pl-8 pr-8 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200"
//     >
//       Connect Your Account
//     </button>
//   )}
// </div>

//         </form>
//       )}
//     </SettingSection>
//   );
// };

// export default Notifications;





import { useState, useEffect } from "react";
import SettingSection from "./SettingSection";
import { Bell } from "lucide-react";
import CryptoJS from "crypto-js";

const Notifications = () => {
  // Form data state
  const [formData, setFormData] = useState({
    tenantId: "",
    clientId: "",
    clientSecret: "",
    azureEmail: "",
    subscriptionId: "",
  });
  // New flag to indicate whether an account exists on the backend
  const [accountExists, setAccountExists] = useState(false);
  const [loading, setLoading] = useState(false);

  // API endpoints from environment variables
  const fetchApiUrl = import.meta.env.VITE_AZURE_DETAILS_FETCH_API_URL;
  const storeApiUrl = import.meta.env.VITE_AZURE_DETAILS_STORE_API_URL;
  const updateApiUrl = import.meta.env.VITE_AZURE_DETAILS_UPDATE_API_URL;
  const deleteApiUrl = import.meta.env.VITE_AZURE_DETAILS_DELETE_API_URL;

  // Encryption parameters
  const key = import.meta.env.VITE_CRYPTO_KEY;
  const iv = import.meta.env.VITE_CRYPTO_IV;

  // Fetch existing Azure account data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(fetchApiUrl, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();

        // Check if azureAccounts exists and has at least one item
        if (data.azureAccounts && data.azureAccounts.length > 0) {
          const account = data.azureAccounts[0]; // Use the first account
          setFormData({
            tenantId: account.tenantId || "",
            clientId: account.clientId || "",
            clientSecret: account.clientSecret || "",
            subscriptionId: account.subscriptionId || "",
            azureEmail: account.azureEmail || "",
          });
          setAccountExists(true);
        } else {
          // No Azure account found; clear form fields and mark account as not existing
          setFormData({
            tenantId: "",
            clientId: "",
            clientSecret: "",
            subscriptionId: "",
            azureEmail: "",
          });
          setAccountExists(false);
        }
      } catch (error) {
        console.error("Error fetching Azure details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [fetchApiUrl]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Encrypt a piece of data using AES-256-CBC with CryptoJS
  function encryptData(data) {
    const plaintext = JSON.stringify(data);
    const keyHex = CryptoJS.enc.Hex.parse(key);
    const ivHex = CryptoJS.enc.Hex.parse(iv);
    const encrypted = CryptoJS.AES.encrypt(plaintext, keyHex, {
      iv: ivHex,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.ciphertext.toString(CryptoJS.enc.Hex);
  }

  // Submit the form – choose between store (POST) or update (PUT) based on accountExists
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Encrypt the sensitive fields
      const encryptedTenantId = encryptData(formData.tenantId);
      const encryptedClientId = encryptData(formData.clientId);
      const encryptedClientSecret = encryptData(formData.clientSecret);

      // Prepare the payload with encrypted values and other fields as provided
      const encryptedData = {
        tenantId: encryptedTenantId,
        clientId: encryptedClientId,
        clientSecret: encryptedClientSecret,
        azureEmail: formData.azureEmail,
        subscriptionId: formData.subscriptionId,
      };

      console.log("Encrypted Data:", encryptedData);

      // Choose the API endpoint and HTTP method based on whether an account exists
      const targetUrl = accountExists ? updateApiUrl : storeApiUrl;
      const method = accountExists ? "PUT" : "POST";

      const response = await fetch(targetUrl, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(encryptedData),
      });

      const result = await response.json();
      alert(result.message);

      // If new data was stored, mark the account as existing
      if (!accountExists && response.ok) {
        setAccountExists(true);
      }
    } catch (error) {
      console.error("Error storing Azure details:", error);
    }
  };

  // Delete the connected Azure account
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete the Azure account?")) return;
    try {
      const response = await fetch(deleteApiUrl, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();
      alert(result.message);
      // Clear the form and update the flag after deletion
      setFormData({
        tenantId: "",
        clientId: "",
        clientSecret: "",
        subscriptionId: "",
        azureEmail: "",
      });
      setAccountExists(false);
    } catch (error) {
      console.error("Error deleting Azure account:", error);
    }
  };

  return (
    <SettingSection icon={Bell} title={"Connect Your Azure Account"}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form className="max-w-full pl-10 pr-10 mx-auto" onSubmit={handleSubmit}>
          {/* Azure Email */}
          <div className="relative z-0 w-full mb-5 group">
            <input
              name="azureEmail"
              type="email"
              value={formData.azureEmail}
              onChange={handleChange}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="azureEmail"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Enter Your Azure Email ID
            </label>
          </div>

          {/* Tenant ID */}
          <div className="relative z-0 w-full mb-5 group">
            <input
              name="tenantId"
              value={formData.tenantId}
              onChange={handleChange}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="tenantId"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Enter Your Azure Tenant ID
            </label>
          </div>

          {/* Client ID */}
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="clientId"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Enter Your Azure Client ID
            </label>
          </div>

          {/* Client Secret */}
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="password"
              name="clientSecret"
              value={formData.clientSecret}
              onChange={handleChange}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              autoComplete="current-password"
              required
            />
            <label
              htmlFor="clientSecret"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Enter Your Azure Client Secret
            </label>
          </div>

          {/* Subscription ID */}
          <div className="relative z-0 w-full mb-5 group">
            <input
              name="subscriptionId"
              value={formData.subscriptionId}
              onChange={handleChange}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="subscriptionId"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Enter Your Azure Subscription ID
            </label>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 pt-8 flex gap-4">
            {accountExists ? (
              <>
                <button
                  type="submit"
                  className="bg-indigo-600 pl-8 pr-8 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200"
                >
                  Update Your Account
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="bg-red-600 pl-8 pr-8 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-200"
                >
                  Delete Account
                </button>
              </>
            ) : (
              <button
                type="submit"
                className="bg-indigo-600 pl-8 pr-8 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200"
              >
                Connect Your Account
              </button>
            )}
          </div>
        </form>
      )}
    </SettingSection>
  );
};

export default Notifications;
