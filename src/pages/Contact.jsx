import { useState } from "react"
import ParticlesBackground from "../components/ParticlesBackground"
import emailjs from "@emailjs/browser"
import { motion } from "framer-motion"
import Astra from "../assets/Astra.png"

const SERVICE_ID = import.meta.env.VITE_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_TEMPLATE_ID
const PUBLIC_KEY = import.meta.env.VITE_PUBLIC_KEY

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    budget: "",
    idea: "",
  })

  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "budget" && value && !/^\d+$/.test(value)) return;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  }

  const validateForm = () => {
    const required = ["name", "email", "service", "idea"];
    const newErrors = {};
    required.forEach((f) => !formData[f].trim() && (newErrors[f] = "This field is required."));
    if (formData.service !== "other" && formData.service && !formData.budget.trim())
      newErrors.budget = "Please provide a budget estimate.";
    setErrors(newErrors);
    return !Object.keys(newErrors).length;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setStatus("sending");
    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        ...formData,
        from_name: formData.name,
        reply_to: formData.email,
      },
        PUBLIC_KEY
      );
      setStatus("success");
      setFormData({
        name: "",
        email: "",
        service: "",
        budget: "",
        idea: "",
      });
      setTimeout(() => setStatus(""), 3000);
    } catch (error) {
      console.error("Email sending error:", error);
      setStatus("error");
      setTimeout(() => setStatus(""), 3000);
    }
  }

  return (
    <section id="contact" className="w-full min-h-screen relative bg-black overflow-hidden text-white py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
      <ParticlesBackground />

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 sm:gap-10 md:gap-12 lg:gap-16">
          
          {/* Left Side - Image */}
          <motion.div 
            className="w-full lg:w-1/2 flex justify-center items-center"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.img 
              src={Astra} 
              alt="Contact"
              className="w-48 sm:w-56 md:w-64 lg:w-80 xl:w-96 rounded-2xl shadow-lg object-cover"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Right Side - Form */}
          <motion.div 
            className="w-full lg:w-1/2 max-w-2xl bg-white/5 p-6 sm:p-7 md:p-8 lg:p-10 rounded-2xl shadow-lg border border-white/10"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-5 md:mb-6">
              Let's Connect!
            </h2>
            
            <form className="flex flex-col gap-4 sm:gap-5" onSubmit={handleSubmit}>
              {/* Name Field */}
              <div className="flex flex-col">
                <label className="mb-1 sm:mb-2 text-sm sm:text-base">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`p-3 sm:p-3.5 rounded-md bg-white/10 border ${errors.name ? 'border-red-500' : 'border-gray-500'} text-white text-sm sm:text-base placeholder:text-gray-400 focus:outline-none focus:border-blue-500 transition-colors`}
                />
                {errors.name && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Email Field */}
              <div className="flex flex-col">
                <label className="mb-1 sm:mb-2 text-sm sm:text-base">
                  Your Email <span className="text-red-500">*</span>
                </label>
                <input 
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`p-3 sm:p-3.5 rounded-md bg-white/10 border ${errors.email ? 'border-red-500' : 'border-gray-500'} text-white text-sm sm:text-base placeholder:text-gray-400 focus:outline-none focus:border-blue-500 transition-colors`}
                />
                {errors.email && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Service Field */}
              <div className="flex flex-col">
                <label className="mb-1 sm:mb-2 text-sm sm:text-base">
                  Service Needed <span className="text-red-500">*</span>
                </label>
                <select 
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className={`p-3 sm:p-3.5 rounded-md bg-white/10 border ${errors.service ? 'border-red-500' : 'border-gray-500'} text-white text-sm sm:text-base focus:outline-none focus:border-blue-500 transition-colors`}
                >
                  <option value="" disabled>Select a service</option>
                  <option value="Web Development" className="text-black">
                    Web Development
                  </option>
                  <option value="other" className="text-black">
                    Others
                  </option>
                </select>
                {errors.service && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.service}</p>}
              </div>

              {/* Budget Field - Conditional */}
              {formData.service && formData.service !== "other" && (
                <div className="flex flex-col">
                  <label className="mb-1 sm:mb-2 text-sm sm:text-base">
                    Budget <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text"
                    name="budget"
                    placeholder="Your Budget"
                    onChange={handleChange}
                    value={formData.budget}
                    className={`p-3 sm:p-3.5 rounded-md bg-white/10 border ${errors.budget ? 'border-red-500' : 'border-gray-500'} text-white text-sm sm:text-base placeholder:text-gray-400 focus:outline-none focus:border-blue-500 transition-colors`}
                  />
                  {errors.budget && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.budget}</p>}
                </div>
              )}

              {/* Idea Field */}
              <div className="flex flex-col">
                <label className="mb-1 sm:mb-2 text-sm sm:text-base">
                  Explain Your Idea <span className="text-red-500">*</span>
                </label>
                <textarea 
                  name="idea"
                  rows={4}
                  placeholder="Describe your project idea..."
                  value={formData.idea}
                  onChange={handleChange}
                  className={`p-3 sm:p-3.5 rounded-md bg-white/10 border ${errors.idea ? 'border-red-500' : 'border-gray-500'} text-white text-sm sm:text-base placeholder:text-gray-400 focus:outline-none focus:border-blue-500 resize-none transition-colors`}
                />
                {errors.idea && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.idea}</p>}
              </div>

              {/* Status Message */}
              {status && (
                <p className={`text-xs sm:text-sm ${status === "success" ? "text-green-400" : status === "error" ? "text-red-400" : "text-yellow-400"}`}>
                  {status === "sending" ? "Sending..." : status === "success" ? "Message sent successfully! ✅" : "Failed to send message. Please try again later. ❌"}
                </p>
              )}

              {/* Submit Button */}
              <motion.button 
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 sm:py-3.5 rounded-md font-semibold text-sm sm:text-base transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={status === "sending"}
                type="submit"
              >
                {status === "sending" ? "Sending..." : "Send Message"}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}