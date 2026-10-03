import { useState, useEffect } from "react";
import SettingSection from "./SettingSection";
import { Cloud, Check, Key, ShieldCheck, Trash2, ArrowRight } from "lucide-react";
import CryptoJS from "crypto-js";

const Notifications = () => {
  const [formData, setFormData] = useState({
    tenantId: "",
    clientId: "",
    clientSecret: "",
    azureEmail: "",
    subscriptionId: "",
  });
  const [accountExists, setAccountExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const fetchApiUrl = import.meta.env.VITE_AZURE_DETAILS_FETCH_API_URL;
  const storeApiUrl = import.meta.env.VITE_AZURE_DETAILS_STORE_API_URL;
  const updateApiUrl = import.meta.env.VITE_AZURE_DETAILS_UPDATE_API_URL;
  const deleteApiUrl = import.meta.env.VITE_AZURE_DETAILS_DELETE_API_URL;

  const key = import.meta.env.VITE_CRYPTO_KEY;
  const iv = import.meta.env.VITE_CRYPTO_IV;

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

        if (data.azureAccounts && data.azureAccounts.length > 0) {
          const account = data.azureAccounts[0];
          setFormData({
            tenantId: account.tenantId || "",
            clientId: account.clientId || "",
            clientSecret: account.clientSecret || "",
            subscriptionId: account.subscriptionId || "",
            azureEmail: account.azureEmail || "",
          });
          setAccountExists(true);
        }
      } catch (error) {
        console.error("Error fetching Azure details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [fetchApiUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const encryptedData = {
        tenantId: encryptData(formData.tenantId),
        clientId: encryptData(formData.clientId),
        clientSecret: encryptData(formData.clientSecret),
        azureEmail: formData.azureEmail,
        subscriptionId: formData.subscriptionId,
      };

      const targetUrl = accountExists ? updateApiUrl : storeApiUrl;
      const method = accountExists ? "PUT" : "POST";

      const response = await fetch(targetUrl, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(encryptedData),
      });

      const result = await response.json();
      setStatusMessage(result.message || "Account saved successfully!");
      if (!accountExists && response.ok) {
        setAccountExists(true);
      }
    } catch (error) {
      console.error("Error storing Azure details:", error);
      setStatusMessage("Failed to save credentials.");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to disconnect this Azure account?")) return;
    try {
      const response = await fetch(deleteApiUrl, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();
      setStatusMessage(result.message || "Account disconnected");
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
    <div className="rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-6 shadow-xl mb-8">
      <div className="flex items-center justify-between pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Cloud size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-heading">
              Azure Service Principal Credentials
            </h3>
            <p className="text-xs text-slate-400">
              Credentials are encrypted using AES-256 before leaving your browser
            </p>
          </div>
        </div>

        {accountExists && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Check size={12} /> Connected
          </span>
        )}
      </div>

      {statusMessage && (
        <div className="my-4 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs">
          {statusMessage}
        </div>
      )}

      {loading ? (
        <div className="py-8 text-center text-xs text-slate-400">Loading credentials...</div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Azure Account Email
              </label>
              <input
                name="azureEmail"
                type="email"
                required
                value={formData.azureEmail}
                onChange={handleChange}
                placeholder="admin@yourcompany.onmicrosoft.com"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Subscription ID
              </label>
              <input
                name="subscriptionId"
                required
                value={formData.subscriptionId}
                onChange={handleChange}
                placeholder="00000000-0000-0000-0000-000000000000"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Directory (Tenant) ID
              </label>
              <input
                name="tenantId"
                required
                value={formData.tenantId}
                onChange={handleChange}
                placeholder="c051f8fb-..."
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Application (Client) ID
              </label>
              <input
                name="clientId"
                required
                value={formData.clientId}
                onChange={handleChange}
                placeholder="fd66ca79-..."
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Client Secret Value
            </label>
            <input
              type="password"
              name="clientSecret"
              required
              value={formData.clientSecret}
              onChange={handleChange}
              placeholder="••••••••••••••••••••••••••••••••"
              className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-mono"
            />
          </div>

          <div className="pt-4 flex items-center gap-3">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-900 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-md shadow-cyan-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>{accountExists ? "Update Azure Account" : "Connect Azure Account"}</span>
              <ArrowRight size={14} />
            </button>

            {accountExists && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 size={14} />
                <span>Disconnect</span>
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default Notifications;
