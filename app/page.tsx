import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Your Project</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-600 hover:text-gray-800">
                  About
                </a>
              </li>
              <li>
                <a href="#features" className="text-gray-600 hover:text-gray-800">
                  Features
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-600 hover:text-gray-800">
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gray-100">
          <div className="container mx-auto px-4 py-20 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Welcome to Your Project
              </h2>
              <p className="text-gray-600 mb-6">
                This project aims to deliver an outstanding experience by integrating modern technologies
                and best practices. Customize this space to describe your mission, vision,
                or unique value proposition.
              </p>
              <a
                href="#get-started"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
              >
                Get Started
              </a>
            </div>
            <div>
              <Image
                src="/hero-image.jpg"
                alt="Hero Image"
                width={500}
                height={400}
                className="rounded"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto px-4 py-20">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Features
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <Image
                src="/feature1.png"
                alt="Feature 1"
                width={64}
                height={64}
              />
              <h4 className="mt-4 text-xl font-semibold">Feature One</h4>
              <p className="mt-2 text-gray-600 text-center">
                A brief explanation of feature one.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Image
                src="/feature2.png"
                alt="Feature 2"
                width={64}
                height={64}
              />
              <h4 className="mt-4 text-xl font-semibold">Feature Two</h4>
              <p className="mt-2 text-gray-600 text-center">
                A brief explanation of feature two.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Image
                src="/feature3.png"
                alt="Feature 3"
                width={64}
                height={64}
              />
              <h4 className="mt-4 text-xl font-semibold">Feature Three</h4>
              <p className="mt-2 text-gray-600 text-center">
                A brief explanation of feature three.
              </p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="bg-gray-50">
          <div className="container mx-auto px-4 py-20">
            <h3 className="text-3xl font-bold text-center text-gray-800 mb-8">
              About Us
            </h3>
            <div className="max-w-3xl mx-auto text-center text-gray-600">
              <p>
                Our mission is to provide excellent service and innovative solutions
                that empower both businesses and individuals. We combine creativity with technology
                to craft experiences that truly make a difference.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Your Project. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
