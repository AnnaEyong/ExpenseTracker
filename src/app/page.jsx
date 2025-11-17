"use client"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import HomeNav from "./components/navbar/HomeNav"
import {
  Wallet,
  BarChart2,
  Shield,
  UserCheck,
  Clock,
  Activity,
  Bell,
  Repeat,
  Layers,
  TrendingUpIcon
} from "lucide-react"
import { Pie } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"

ChartJS.register(ArcElement, Tooltip, Legend)

export default function HomePage() {
  const router = useRouter()

  const handleGetStarted = () => {
    const loggedInUser = localStorage.getItem("loggedInUser")
    if (loggedInUser) router.push("/dashboard")
    else router.push("/login")
  }

  // Sample data for mini chart & table
  const sampleExpenses = [
    { name: "Groceries", amount: 50, category: "Food", date: '11/11/25' },
    { name: "Transport", amount: 20, category: "Travel", date: '10/11/25' },
    { name: "Subscription", amount: 30, category: "Bills", date: '09/11/25' },
    { name: "Coffee", amount: 10, category: "Food", date: '08/11/25' }
  ]

  const categories = {}
  sampleExpenses.forEach((e) => {
    if (categories[e.category]) categories[e.category] += e.amount
    else categories[e.category] = e.amount
  })

  const chartData = {
    labels: Object.keys(categories),
    datasets: [
      {
        data: Object.values(categories),
        backgroundColor: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#F472B6"],
        borderWidth: 0,
        cutout: '50%'
      }
    ]
  }

// ADD THIS LEGEND OPTION FOR CIRCLES
  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          boxHeight: 9, // adjust this for circle diameter
          boxWidth: 9   // keeps text close to the circle
        }
      }
    }
  }

  const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl dark:shadow-2xl border border-gray-100 dark:border-slate-700/50 
                hover:border-indigo-600 dark:hover:border-indigo-600 transition duration-300 transform hover:-translate-y-1">
    <div className="p-2 bg-indigo-600 rounded-lg text-white mb-4 shadow-lg shadow-indigo-600/30">
      <Icon className="w-4.5 h-4.5" />
    </div>
    <h3 className="text-xl font-bold mb-2 text-gray-900 text-center dark:text-white">{title}</h3>
    <p className="text-gray-600 dark:text-slate-400 text-center">{description}</p>
  </div>
);

const TestimonialCard = ({ quote, name, title }) => (
  <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-xl dark:shadow-2xl border border-gray-100 dark:border-slate-700/50 transition duration-300 hover:shadow-indigo-500/20">
    <p className="text-lg italic text-gray-700 dark:text-slate-300 mb-6 leading-relaxed">
      "{quote}"
    </p>
    <div className="flex items-center">
      <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-semibold mr-3 text-sm">
        {name[0]}
      </div>
      <div>
        <p className="font-bold text-sm text-gray-900 dark:text-white">{name}</p>
        <p className="text-xs text-indigo-600 dark:text-indigo-400">{title}</p>
      </div>
    </div>
  </div>
);

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 dark:border-slate-700/70">
      <button
        className="flex justify-between items-center w-full py-5 text-left font-semibold text-lg text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>{question}</span>
        <ChevronDownIcon className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'transform rotate-180 text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-slate-400'}`} />
      </button>
      <div
        // A utility class (max-h-96) is used here to allow the height transition to work properly
        className={`overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-96 opacity-100 py-3' : 'max-h-0 opacity-0'}`}
      >
        <p className="text-gray-600 dark:text-slate-400 pb-5 pr-4 leading-relaxed">
          {answer}
        </p>
      </div>
    </div>
  );
};


// --- FAQ Data ---
const faqData = [
  {
    question: "Is Pennywise truly free to start?",
    answer: "Yes, our Starter plan is permanently free. It includes unlimited expense entry and basic category reports. You only need to upgrade if you require premium features like predictive forecasting or data exports."
  },
  {
    question: "Do you offer multi-currency support?",
    answer: "Currently, Pennywise supports all major global currencies and allows you to track expenses in multiple currencies simultaneously. Conversion rates are updated daily. Our Premium plan includes automatic currency syncing."
  },
  {
    question: "How secure is my financial data?",
    answer: "We use enterprise-grade security protocols, including 256-bit encryption for data in transit and at rest. Your data is never sold or shared with third parties. Your privacy is our highest priority."
  },
  {
    question: "Can I import my existing bank statements?",
    answer: "Yes, you can easily import bank statements via CSV file upload. We also offer automated bank synchronization for supported institutions in our Premium Pro plan."
  },
  {
    question: "Is there a mobile application?",
    answer: "Yes, Pennywise is available on iOS and Android. The mobile application includes all core features and syncs instantly with the web application."
  },
];


const ChevronDownIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
);


  return (
    <>
    <HomeNav/>
    <div className="flex flex-col ">
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-5 justify-center h-screen overflow-hidden md:pt-20 md:pb-5 pt-20 md:px-15 px-5">
      <div className=" w-full h-full space-y-4 flex flex-col justify-center md:text-left text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 md:text-center lg:text-left"> Stay in control,  <br />
          <span className="text-indigo-600 dark:text-indigo-400">one expense at a time.</span>
        </h1>
        <p className="text-lg mb-8 max-w-xl mx-auto md:text-center lg:text-left">
           Spend smarter, budget better, and build tomorrow! Start now from one dashboard. Track every expense, and gain total clarity on your financial journey, all in one place.
        </p>

        <article className='flex justify-between'>
            <div className='bg-card shadow-[0_8px_30px_rgba(0,0,0,0.1)] rounded-lg py-4 px-3 w-[32%]'>
                <h1 className='text-xl font-semibold'>100+</h1>
                <p className='text-[#999999] text-[13px]'>Happy Users</p>
            </div>
            <div className='bg-card shadow-[0_8px_30px_rgba(0,0,0,0.1)] rounded-lg py-4 px-3 w-[32%]'>
                <h1 className='text-xl font-semibold'>100+</h1>
                <p className='text-[#999999] text-[13px]'>Active Accounts</p>
            </div>
            <div className='bg-card  shadow-[0_8px_30px_rgba(0,0,0,0.1)] rounded-lg py-4 px-3 w-[32%]'>
                <h1 className='text-xl font-semibold'>2+</h1>
                <p className='text-[#999999] text-[13px]'>Years of Experience</p>
            </div>
        </article>

        <button
          onClick={handleGetStarted}
          className="mt-[.5rem] lg:mt-[2rem] bg-indigo-600 dark:bg-indigo-400 hover:bg-indigo-500 w-full md:w-fit text-white  cursor-pointer font-semibold px-8 py-3 rounded-lg md:rounded-full transition transform hover:scale-105"
        >
          Get Started For Free
        </button>
      </div>

      {/* <div className=" relative hidden md:flex bg-card shadow-[0_8px_30px_rgba(0,0,0,0.1)] dark:bg-card pt-5 justify-center rounded-2xl h-full">
        <img src='/phone1.png' alt='img' className='w-70 -rotate-14 -mr-12 relative z-2'/>
        <img src='/phone2.png' alt='img' className='w-60 -rotate-4 -ml-10'/>
      </div> */}

        <img src='lady.jpg' alt='hero' className='w-full h-full rounded-2xl object-cover shadow-[0_8px_30px_rgba(0,0,0,0.3)]'/>
    </section>

      {/* Features Section
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-12 font-[Playwrite DE Grund+Guides]">Why Choose Our Expense Tracker?</h2>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 lg:grid-cols-3 gap-8">
          {[{
            icon: Wallet, title: "Track Spending", desc: "Keep all your expenses organized in one easy-to-use platform."
          },{
            icon: BarChart2, title: "Analyze Trends", desc: "Visualize your spending patterns and plan ahead efficiently."
          },{
            icon: Shield, title: "Secure & Private", desc: "Your data is stored safely in your browser — fully private."
          },{
            icon: Bell, title: "Budget Alerts", desc: "Get notifications when spending exceeds your set limits."
          },{
            icon: Repeat, title: "Recurring Expenses", desc: "Track subscriptions and recurring payments automatically."
          },{
            icon: Layers, title: "Multi-category Analysis", desc: "Analyze spending per category and spot trends easily."
          }].map((feature, idx) => {
            const Icon = feature.icon
            return (
              <div key={idx} className="p-8 rounded-xl shadow hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] transition transform ease-in-out hover:-translate-y-5">
                <Icon className="text-blue-600 w-16 h-16 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            )
          })}
        </div>
      </section> */}

      {/* Features Section */}
      <section id="features" className="md:py-18 pt-5 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold uppercase text-sm tracking-widest">Core Capabilities</span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
              Why Choose Our Expense Tracker?
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-slate-400 max-w-3xl mx-auto">
              Pennywise provides powerful yet simple tools to help you budget, analyze, and forecast your financial future.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
            <FeatureCard
              icon={Wallet}
              title="Track Spending"
              description="Keep all your expenses organized in one easy-to-use platform."
            />
            <FeatureCard
              icon={BarChart2}
              title="Analyze Trends"
              description="Visualize your spending patterns and plan ahead efficiently."
            />
            <FeatureCard
              icon={Shield}
              title="Secure & Private"
              description="Your data is stored safely in your browser, fully private."
            />
            <FeatureCard
              icon={Bell}
              title="Budget Alerts"
              description="Get notifications when spending exceeds your set limits."
            />
            <FeatureCard
              icon={Layers}
              title="Multi-category Analysis"
              description="Analyze spending per category and spot trends easily."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-12">How It Works</h2>
        <div className="max-w-6xl mx-auto grid md:grid-cols-5 gap-6">
          {[{
            icon: UserCheck, title: "Sign Up", desc: "Create an account to start tracking your expenses."
          },{
            icon: Activity, title: "Add Expenses", desc: "Quickly add daily expenses and categorize them."
          },{
            icon: Clock, title: "View Summary", desc: "See all your expenses summarized in one view."
          },{
            icon: BarChart2, title: "Analyze Trends", desc: "Track patterns and make smarter financial decisions."
          },{
            icon: Shield, title: "Secure Data", desc: "All data stays private and secure in your browser."
          }].map((step, idx) => {
            const Icon = step.icon
            return (
              <div key={idx} className="dark:text-gray-500 bg-card p-6 rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1">
                <Icon className="text-blue-600 w-12 h-12 mb-4 mx-auto" />
                <h3 className="font-semibold mb-2 text-black dark:text-white">{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            )
          })}
        </div>
      </section> */}


        {/* How it works */}
      <section id="features" className="md:py-3 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold uppercase text-sm tracking-widest">Core Capabilities</span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-slate-400 max-w-3xl mx-auto">
              Pennywise provides powerful yet simple tools to help you budget, analyze, and forecast your financial future.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
            <FeatureCard
              icon={UserCheck}
              title="Sign Up"
              description="Create an account to start tracking your expenses."
            />
            <FeatureCard
              icon={Activity}
              title="Add Expense"
              description="Quickly add daily expenses and categorize them."
            />
            <FeatureCard
              icon={Clock}
              title="View Summary"
              description="See all your expenses summarized in one view."
            />
            <FeatureCard
              icon={BarChart2}
              title="Analyze Trends"
              description="Track patterns and make smarter financial decisions."
            />
            <FeatureCard
              icon={Shield}
              title="Secure Data"
              description="All data stays private and secure in your browser."
            />
            
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      {/* <section className="py-16 px-6 bg-gray-50 dark:bg-background flex flex-col justify-center items-center gap-8 text-center">
        <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
            Dashboard preview
        </h2>
        <img src='dashboard1.png' alt='' className='max-w-4xl rounded-4xl hidden md:flex'/>
        <img src='mdash.png' alt='' className='max-w-4xl rounded-4xl flex md:hidden'/>
      </section> */}

       {/* Dashboard Preview Section */}
      <section className="md:py-16 py-5 px-4 text-center">
        <h2 className="md:mt-4 text-3xl pb-5 sm:text-4xl font-extrabold text-gray-900 dark:text-white">
            Dashboard preview
        </h2>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-card p-6 rounded-xl shadow-xl dark:shadow-2xl">
            <h3 className="font-semibold mb-4">Expense Table</h3>
            <div className="overflow-x-auto hidden md:flex">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="border-b px-4 py-2">Item</th>
                    <th className="border-b px-4 py-2">Amount</th>
                    <th className="border-b px-4 py-2">Category</th>
                    <th className="border-b px-4 py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleExpenses.map((e, idx) => (
                    <tr key={idx}>
                      <td className="border-b px-4 py-2">{e.name}</td>
                      <td className="border-b px-4 py-2">${e.amount}</td>
                      <td className="border-b px-4 py-2">{e.category}</td>
                      <td className="border-b px-4 py-2">{e.date}</td>
                    </tr>
                  ))}
              </tbody>
              </table>
            </div>

            {/* mobile layout */}
        <div className="overflow-x-auto flex md:hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="border-b px-4 py-2">Item</th>
                    <th className="border-b px-4 py-2">Amount</th>
                    <th className="border-b px-4 py-2">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleExpenses.map((e, idx) => (
                    <tr key={idx}>
                      <td className="border-b px-4 py-2">{e.name}</td>
                      <td className="border-b px-4 py-2">${e.amount}</td>
                      <td className="border-b px-4 py-2">{e.category}</td>
                    </tr>
                  ))}
              </tbody>
              </table>
            </div>

          </div>
          <div className="p-6 rounded-xl bg-card shadow-xl dark:shadow-2xl">
            <h3 className="font-semibold mb-4">Expense Chart</h3>
            <div className="w-full h-48 mx-auto">
              <Pie data={chartData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      </section>


      {/* Testimonials Section
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-12">What Our Users Say</h2>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {[{
            text: "This expense tracker completely changed how I manage my money. Simple and effective!",
            author: "Anna E."
          },{
            text: "I love seeing my spending trends. It helps me save more every month.",
            author: "James K."
          },{
            text: "Clean, easy to use, and very intuitive. Perfect for beginners and pros alike.",
            author: "Maria L."
          }].map((t, idx) => (
            <div key={idx} className="bg-card p-6 rounded-xl shadow">
              <p className="mb-4">{t.text}</p>
              <span className="font-semibold">— {t.author}</span>
            </div>
          ))}
        </div>
      </section> */}

      {/* Testimonials Section */}
      <section id="testimonials" className="md:py-5 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold uppercase text-sm tracking-widest">Social Proof</span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
              Don't Just Take Our Word For It
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <TestimonialCard
              quote="The clean interface and powerful reporting tools finally made expense tracking stick for me. Highly recommended."
              name="Alex Chen"
              title="Financial Consultant"
            />
            <TestimonialCard
              quote="I paid off $10k in debt largely thanks to the visualization features. It was a game-changer for my budgeting."
              name="Jessica Lee"
              title="Small Business Owner"
            />
            <TestimonialCard
              quote="Seamless multi-device access and bank-level security. Pennywise is the professional choice for personal finance."
              name="Michael R."
              title="Software Architect"
            />
            <TestimonialCard
              quote="The clean interface and powerful reporting tools finally made expense tracking stick for me. Highly recommended."
              name="Lisa Jones"
              title="Financial Consultant"
            />
          </div>
        </div>
      </section>

            {/* FAQ Section */}
      <section id="faq" className="md:py-18 py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold uppercase text-sm tracking-widest">Help Center</span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
              Questions & Answers
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
              Everything you need to know about Pennywise and how to start tracking your expenses today.
            </p>
          </div>
          
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl shadow-2xl dark:shadow-3xl dark:shadow-slate-900/50 border border-gray-200 dark:border-slate-700/70">
            {faqData.map((item, index) => (
              <FAQItem key={index} question={item.question} answer={item.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-blue-600 text-white text-center relative h-[50vh]">
        <img src='chart.jpg' alt='image' className='w-full h-full object-cover'/>
        <div className='absolute w-full h-full top-0 bg-black/30'/>
        <div className='absolute w-full h-full top-25'>
        <h2 className="text-3xl font-semibold">Ready to Take Control?</h2>
        <p className="mb-8 max-w-xl mx-auto">Sign up now and start tracking your expenses today!</p>
        <button
          onClick={handleGetStarted}
          className="bg-white cursor-pointer text-blue-600 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition transform hover:scale-105"
        >
          Get Started
        </button>
        </div>
      </section>

      
      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-slate-800 text-gray-800 dark:text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            {/* Logo/Branding */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              Expense<span className="text-gray-800 dark:text-gray-200">Tracker</span>
            </span>
          </div>
              <p className="text-sm text-gray-500 dark:text-slate-400">Track smarter, save faster.</p>
            </div>


            {/* Product Links */}
            <div>
              <h4 className="font-bold text-sm mb-4 uppercase text-indigo-600 dark:text-indigo-400">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-slate-300">
                <li><a href="#features" className="hover:text-gray-900 dark:hover:text-white transition">Features</a></li>
                <li><a href="#pricing" className="hover:text-gray-900 dark:hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition">Mobile App</a></li>
              </ul>
            </div>

            
            {/* Company Links */}
            <div>
              <h4 className="font-bold text-sm mb-4 uppercase text-indigo-600 dark:text-indigo-400">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-slate-300">
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition">Careers</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition">Contact</a></li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="font-bold text-sm mb-4 uppercase text-indigo-600 dark:text-indigo-400">Support</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-slate-300">
                <li><a href="#faq" className="hover:text-gray-900 dark:hover:text-white transition">FAQ</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition">Terms & Privacy</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition">Status</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-300 dark:border-slate-700 text-center">
            <p className="text-sm text-gray-500 dark:text-slate-500">
              &copy; {new Date().getFullYear()} Pennywise Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  </>
  )
}