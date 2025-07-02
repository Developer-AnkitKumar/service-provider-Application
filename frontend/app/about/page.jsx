"use client"
import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import framer-motion to disable SSR
const MotionDiv = dynamic(() => import('framer-motion').then((mod) => mod.motion.div), { ssr: false });

function AboutUs() {
  return (
    <div className="py-16 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-6 md:px-12">
        {/* Header Section */}
        <MotionDiv
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 mb-6">
            About Web Force Network
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connecting users with trusted local service providers across multiple categories with reliability and transparency.
          </p>
        </MotionDiv>

        {/* Mission Section */}
        <MotionDiv
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24 items-center"
        >
          <div className="flex flex-col justify-center space-y-6">
            <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold w-fit">
              Our Mission
            </div>
            <h2 className="text-3xl font-bold text-gray-800">
              Bridging the gap between quality service providers and customers
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              We're dedicated to creating seamless connections that ensure reliability, quality, and satisfaction in every transaction. 
              Our platform empowers both service providers and customers to find exactly what they need.
            </p>
          </div>
          <div className="flex justify-center items-center relative">
            <div className="absolute -z-10 w-full h-full bg-blue-100 rounded-2xl -right-6 -bottom-6"></div>
            <img
              src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
              alt="Mission"
              className="rounded-2xl shadow-xl w-full object-cover aspect-video"
            />
          </div>
        </MotionDiv>

        {/* Values Section */}
        <div className="mb-24">
          <MotionDiv
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="text-center">
              <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Our Values
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Core Principles That Drive Us
              </h2>
            </div>
          </MotionDiv>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Integrity",
                description: "We maintain the highest standards of honesty and transparency in all our interactions.",
                icon: "🤝"
              },
              {
                title: "Customer Satisfaction",
                description: "Our top priority is delivering exceptional service that exceeds customer expectations.",
                icon: "😊"
              },
              {
                title: "Innovation",
                description: "We continuously innovate and adapt to the latest trends and technologies to better serve our customers.",
                icon: "💡"
              },
              {
                title: "Community",
                description: "Building strong local networks that support both businesses and customers alike.",
                icon: "🌍"
              },
              {
                title: "Excellence",
                description: "Committed to delivering the highest quality services and user experience.",
                icon: "⭐"
              },
              {
                title: "Accessibility",
                description: "Making services available to everyone, regardless of technical expertise.",
                icon: "♿"
              }
            ].map((value, index) => (
              <MotionDiv
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-blue-600 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </MotionDiv>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-24">
          <MotionDiv
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="text-center">
              <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Our Team
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                The People Behind Web Force
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Meet our dedicated team of professionals committed to making service connections seamless.
              </p>
            </div>
          </MotionDiv>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                name: "John Doe",
                role: "CEO & Founder",
                image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
              },
              {
                name: "Jane Smith",
                role: "CTO",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
              },
              {
                name: "David Green",
                role: "Head of Marketing",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
              },
              {
                name: "Sarah Johnson",
                role: "Customer Success",
                image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
              }
            ].map((member, index) => (
              <MotionDiv
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="relative overflow-hidden rounded-2xl mb-4 aspect-square">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <div className="text-white text-left">
                      <p className="text-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-100">
                        {member.role}
                      </p>
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
                <p className="text-blue-600">{member.role}</p>
              </MotionDiv>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <MotionDiv
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-12 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers and service providers using our platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold transition-colors duration-300 shadow-lg">
              Contact Us
            </button>
            <button className="border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-full font-semibold transition-colors duration-300">
              Learn More
            </button>
          </div>
        </MotionDiv>
      </div>
    </div>
  );
}

export default AboutUs;