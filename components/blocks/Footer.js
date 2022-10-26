import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/icons'

export default function Footer() {
  return (
    <footer aria-labelledby="footer-heading">
      <div className="mx-auto max-w-7xl py-12 lg:py-16">
        <div className="xl:grid xl:grid-cols-4 xl:gap-8">
          <div className="grid grid-cols-1 gap-8 xl:col-span-2">
            <div className="md:grid md:grid-cols-3 md:gap-8">
              <div>
                <h3 className="text-base font-medium text-gray-900">Categories</h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                      Marketing
                    </a>
                  </li>

                  <li>
                    <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                      Analytics
                    </a>
                  </li>

                  <li>
                    <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                      Commerce
                    </a>
                  </li>

                  <li>
                    <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                      Insights
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-base font-medium text-gray-900">Projects</h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                      Gaudi
                    </a>
                  </li>

                  <li>
                    <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                      Book.it
                    </a>
                  </li>

                  <li>
                    <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                      Ditto
                    </a>
                  </li>

                  <li>
                    <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                      Gaudi-bash
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-base font-medium text-gray-900">About</h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                      Summary
                    </a>
                  </li>

                  <li>
                    <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                      Blog
                    </a>
                  </li>

                  <li>
                    <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                      Press
                    </a>
                  </li>

                  <li>
                    <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                      Publications
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 xl:col-span-2 xl:mt-0">
            <h3 className="text-base font-medium text-gray-900">Subscribe to our newsletter</h3>
            <p className="mt-4 text-base text-gray-500">
              The latest news, articles, and resources, sent to your inbox weekly.
            </p>
            <form className="mt-4 sm:flex sm:max-w-md">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                type="email"
                name="email-address"
                id="email-address"
                autoComplete="email"
                required
                className="w-full min-w-0 appearance-none rounded-md border border-gray-300 bg-white py-2 px-4 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:border-indigo-500 focus:placeholder-gray-400 focus:outline-none focus:ring-indigo-500"
                placeholder="Enter your email"
              />
              <div className="mt-3 rounded-md sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between">
          <div className="flex space-x-6 md:order-2">
            <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} size="5" />
            <SocialIcon kind="github" href={siteMetadata.github} size="5" />
            <SocialIcon kind="facebook" href={siteMetadata.facebook} size="5" />
            <SocialIcon kind="youtube" href={siteMetadata.youtube} size="5" />
            <SocialIcon kind="linkedin" href={siteMetadata.linkedin} size="5" />
            <SocialIcon kind="twitter" href={siteMetadata.twitter} size="5" />
          </div>
          <p className="mt-8 text-base text-gray-400 md:order-1 md:mt-0">
            &copy;{`${new Date().getFullYear()} ${siteMetadata.author}. All rights reserved`}
          </p>
        </div>
      </div>
    </footer>
  )
}
