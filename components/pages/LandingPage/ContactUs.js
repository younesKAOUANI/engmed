import React, { useState } from 'react'

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [status, setStatus] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('Sending...')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      if (response.ok) {
        setStatus('Message sent successfully!')
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        setStatus('Failed to send message.')
      }
    } catch (error) {
      setStatus('Failed to send message.')
    }
  }

  return (
    <div className='section h-auto text-center'>
      <h2 className='text-3xl font-bold text-center text-gray-800 mb-6'>Contact Us</h2>
      <p className='text-lg text-center mb-8'> Got a technical issue? Want to send feedback about a beta feature? Need details about our Business plan? <br /> Let us know.</p>
      <form onSubmit={handleSubmit} className='grid grid-cols-2 gap-4 max-w-4xl mx-auto rounded-xl p-6 shadow-lg bg-white'>
        <input
          type='text'
          id='name'
          placeholder='Name'
          name='name'
          value={formData.name}
          onChange={handleChange}
          className='w-full px-4 py-2 border border-primary rounded-md'
        />

        <input
          type='email'
          id='email'
          placeholder='Email'
          name='email'
          value={formData.email}
          onChange={handleChange}
          className='w-full px-4 py-2 border border-primary rounded-md'
        />
        <input
          type='text'
          id='subject'
          name='subject'
          placeholder='Subject'
          value={formData.subject}
          onChange={handleChange}
          className='w-full px-4 py-2 border border-primary rounded-md col-span-2'
        />
        <textarea
          id='message'
          name='message'
          placeholder='Message'
          value={formData.message}
          onChange={handleChange}
          className='w-full px-4 py-2 border border-primary rounded-md col-span-2'
          rows='3'
        />
        <div className='col-span-2'>
          <button
            type='submit'
            className='bg-primary text-white px-4 py-2 rounded-md hover:scale-95 font-medium text-lg'
          >
            Send
          </button>
        </div>
      </form>
      {status && <p className='mt-4'>{status}</p>}
    </div>
  )
}
