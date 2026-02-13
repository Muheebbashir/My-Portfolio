import { useState } from "react"
import ParticlesBackground from "../components/ParticlesBackground"
import emailjs from "@emailjs/browser"
import { motion } from "framer-motion"
import Astra from "../assets/Astra.png"

const SERVICE_ID = import.meta.env.VITE_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_TEMPLATE_ID
const PUBLIC_KEY = import.meta.env.VITE_PUBLIC_KEY

export default function Contact() {
  const [formData,setFormData]=useState({
    name:"",
    email:"",
    service:"",
    budget:"",
    idea:"",
  })

  const [errors,setErrors]=useState({})
  const [status,setStatus]=useState("")

  const handleChange=(e)=>{
    const {name,value}=e.target;
    if(name==="budget" && value && !/^\d+$/.test(value))return;
    setFormData((p)=>({...p,[name]:value}));
    if(errors[name])setErrors((p)=>({...p,[name]:""}));
  }

  const validateForm=()=>{
    const required=["name","email","service","idea"];
    const newErrors={};
    required.forEach((f)=> !formData[f].trim() && (newErrors[f]="This field is required."));
    if(formData.service !== "other" && formData.service && !formData.budget.trim())
      newErrors.budget="Please provide a budget estimate.";
    setErrors(newErrors);
    return !Object.keys(newErrors).length;
  }

  const handleSubmit=async(e)=>{
    e.preventDefault();
    if(!validateForm())return;
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
        name:"",
        email:"",
        service:"",
        budget:"",
        idea:"",
      });
      setTimeout(() => setStatus(""), 3000);
    } catch (error) {
      console.error("Email sending error:", error);
      setStatus("error");
      setTimeout(() => setStatus(""), 3000);
    }
  }

  return (
    <section id="contact" className="w-full min-h-screen relative bg-black overflow-hidden text-white py-20 px-6 md:px-20 flex flex-col md:flex-row items-center gap-10">
      <ParticlesBackground />

      <div className="relative z-10 w-full flex flex-col md:flex-row items-center gap-10">
        <motion.div className="w-full md:w-1/2 flex justify-center"
          initial={{opacity:0, x:-50}}
          whileInView={{opacity:1,x:0}}
          transition={{duration:0.6}}
          viewport={{once:true}}
        >
          <motion.img src={Astra} alt="Contact"
           className="w-72 md:w-140 rounded-2xl shadow-lg object-cover"
           animate={{y:[0,-10,0]}}
            transition={{duration:2, repeat:Infinity, ease:"easeInOut"}}
          />

        </motion.div>
        {/*Right Side - Form*/}
        <motion.div className="w-full md:w-1/2 bg-white/5 p-8 rounded-2xl shadow-lg border border-white/10"
         initial={{opacity:0, x:50}}
         whileInView={{opacity:1,x:0}}
         transition={{duration:0.6}}
         viewport={{once:true}}
        >
          <h2 className="text-3xl font-bold mb-6">
            Let's Connect!
          </h2>
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <label className="mb-1">
                   Your Name <span className="text-red-500">*</span>   
              </label>
              <input type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className={`p-3 rounded-md bg-white/10 border ${errors.name ? 'border-red-500' : 'border-gray-500'} text-white focus:outline-none focus:border-blue-500`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}

            </div>
            <div className="flex flex-col">
              <label className="mb-1">Your Email <span className="text-red-500">*</span></label>
              <input type="email"
               name="email"
               placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                className={`p-3 rounded-md bg-white/10 border ${errors.email ? 'border-red-500' : 'border-gray-500'} text-white focus:outline-none focus:border-blue-500`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}

            </div>
            <div className="flex flex-col">
              <label className="mb-1">Service Needed <span className="text-red-500">*</span></label>
              <select name="service"
               value={formData.service}
               onChange={handleChange}
                className={`p-3 rounded-md bg-white/10 border ${errors.service ? 'border-red-500' : 'border-gray-500'} text-white focus:outline-none focus:border-blue-500`}
              >
                <option value="" disabled>Select a service</option>
                <option value="Web Development" className="text-black">
                  Web Development
                </option>
                <option value="other" className="text-black">
                  Others
                </option>
              </select>
              {errors.service && <p className="text-red-500 text-xs mt-1">{errors.service}</p>}

            </div>
            {formData.service && formData.service !== "other" && (
              <div className="flex flex-col">
                <label className="mb-1">Budget <span className="text-red-500">*</span></label>
                <input type="text"
                name="budget"
                placeholder="Your Budget"
                onChange={handleChange}
                value={formData.budget}
                className={`p-3 rounded-md bg-white/10 border ${errors.budget ? 'border-red-500' : 'border-gray-500'} text-white focus:outline-none focus:border-blue-500`}
                />
                {errors.budget && <p className="text-red-500 text-xs mt-1">{errors.budget}</p>}

              </div>
            )}
            <div className="flex flex-col">
              <label className="mb-1">
                 Explain Your Idea <span className="text-red-500">*</span>
              </label>
              <textarea name="idea"
               rows={5}
                placeholder="Describe your project idea..."
                value={formData.idea}
                onChange={handleChange}
                className={`p-3 rounded-md bg-white/10 border ${errors.idea ? 'border-red-500' : 'border-gray-500'} text-white focus:outline-none focus:border-blue-500 resize-none`}
              ></textarea>
              {errors.idea && <p className="text-red-500 text-xs mt-1">{errors.idea}</p>}

            </div>
            {status && (
              <p className={`text-sm ${status === "success" ? "text-green-400" : status === "error" ? "text-red-400" : "text-yellow-400"}`}>
                {status === "sending" ? "Sending..." : status === "success" ? "Message sent successfully! ✅" : "Failed to send message. Please try again later. ❌"}
              </p>
            )}
            <motion.button className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-3 rounded-md font-semibold transition"
             whileHover={{scale:1.05}}
             whileTap={{scale:0.95}}
             disabled={status==="sending"}
             type="submit"
            >
              {status==="sending" ? "Sending..." : "Send Message"}
            </motion.button>

          </form>

        </motion.div>

      </div>

    </section>
  )
}