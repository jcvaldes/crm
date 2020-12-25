import Head from 'next/head'
import Layout from '../components/Layout'
import styles from '../styles/Home.module.css'

export default function Index() {
  return (
    <div>
      <Layout>
        <h1 className="text-2xl text-grey-800 font-light">Clientes</h1>
      </Layout>
    </div>
  )
}
