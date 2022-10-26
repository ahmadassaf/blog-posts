import Router from 'next/router'
import { useEffect } from 'react'

export const ClientReload = () => {
  useEffect(() => {
    import('socket.io-client').then((module) => {
      const socket = module.io()
      socket.on('reload', (data) => {
        Router.replace(Router.asPath, undefined, {
          scroll: false,
        })
      })
    })
  }, [])

  return null
}
