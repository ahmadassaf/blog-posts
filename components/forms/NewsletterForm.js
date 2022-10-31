import { useRef, useState } from 'react'

import siteMetadata from '@/data/siteMetadata'

const NewsletterForm = ({ title = 'Subscribe to the newsletter' }) => {
  const inputEl = useRef(null)
  const [error, setError] = useState(false)
  const [message, setMessage] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const subscribe = async (e) => {
    e.preventDefault()

    const res = await fetch(`/api/${siteMetadata.newsletter.provider}`, {
      body: JSON.stringify({
        email: inputEl.current.value,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })

    const { error } = await res.json()
    if (error) {
      setError(true)
      setMessage('Your e-mail address is invalid or you are already subscribed!')
      return
    }

    inputEl.current.value = ''
    setError(false)
    setSubscribed(true)
    setMessage('Successfully! 🎉 You are now subscribed.')
  }

  return (
    <div className="mt-8 xl:col-span-2 xl:mt-0">
      <h3 className="text-base font-medium text-gray-900">Subscribe to my newsletter</h3>
      <p className="mt-4 text-base text-gray-500">
        The latest articles, readings, and resources, sent to your inbox monthly
      </p>
      <form className="mt-4 sm:flex sm:max-w-md" onSubmit={subscribe}>
        <label htmlFor="email-address" className="sr-only">
          Email address
        </label>
        <input
          autoComplete="email"
          id="email-input"
          name="email"
          placeholder={subscribed ? "You're subscribed !  🎉" : 'Enter your email'}
          ref={inputEl}
          required
          type="email"
          disabled={subscribed}
          className="w-full min-w-0 appearance-none rounded-md border border-gray-300 bg-white py-2 px-4 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:border-indigo-500 focus:placeholder-gray-400 focus:outline-none focus:ring-indigo-500"
        />
        <div className="mt-3 rounded-md sm:mt-0 sm:ml-3 sm:flex-shrink-0">
          <button
            type="submit"
            disabled={subscribed}
            className={`flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-base font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              subscribed ? 'cursor-default' : 'hover:bg-primary-700 dark:hover:bg-primary-400'
            } focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 dark:ring-offset-black`}
          >
            {subscribed ? 'Thank you!' : 'Sign up'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewsletterForm

export const BlogNewsletterForm = ({ title }) => (
  <div className="flex items-center justify-center">
    <div className="bg-gray-100 p-6 dark:bg-gray-800 sm:px-14 sm:py-8">
      <NewsletterForm title={title} />
    </div>
  </div>
)
