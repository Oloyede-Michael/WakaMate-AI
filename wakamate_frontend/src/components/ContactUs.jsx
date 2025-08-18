import React from 'react'
import CircularGallery from './CircularGallery'

const ContactUs = () => {
  return (
    <div className='bg-zinc-900'>
       <div style={{ height: '600px', position: 'relative' }}>
         <CircularGallery bend={3} textColor="#ffffff" borderRadius={0.05} scrollEase={0.02}/>
        </div>
      <h1 className='text-4xl sm:text-6xl md:text-8xl lg:text-8xl  pt-30 px-10 text-white'>HAVE QUESTIONS? <br />  LET'S CONNECT</h1>
         <div className='flex pt-20 px-10 justify-between items-center flex-col md:flex-row'>
        <form className="space-y-6 text-white w-full max-w-xl">
            <div className="flex flex-col md:flex-row gap-6">
              <input
                type="text"
                placeholder="Name"
                className="bg-transparent border-b border-white outline-none w-full placeholder-zinc-400"
              />
              <input
                type="email"
                placeholder="Email"
                className="bg-transparent border-b border-white outline-none w-full placeholder-zinc-400"
              />
            </div>

            <textarea
              placeholder="Your message..."
              rows="5"
              className="bg-transparent border-b border-white outline-none w-full placeholder-zinc-400 resize-none overflow-hidden"
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
            ></textarea>

            <button
              type="submit"
              className="border-2 cursor-pointer border-green-500 text-white hover:bg-green-500 bg-black text-[1.2em] hover:scale-110 transition hover:text-black duration-300" style={{borderRadius:'0% 20px', boxShadow: '0px 3px 3px rgb(54, 54, 54)', padding:'1.25rem 3.75rem', margin:'1em 0em'}}
            >
              Submit
            </button>
          </form>
                {/* Right Side - Contact Info */}
                <section className='pt-10'>
                <div className="w-full text-white">
                  <h2 className="text-xl font-medium mb-4">Get in touch</h2>
                  <a
                    href="mailto:mentrahealth@gmail.com"
                    className="block  mb-2 text-white transition"
                  >
                   wakamate@gmail.com ↗
                  </a>
                  <p className="">+234 816 892 4256</p>
                </div>
            </section>
          </div> 
    </div>
  )
}

export default ContactUs