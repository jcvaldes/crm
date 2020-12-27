import { gql, useQuery } from '@apollo/client'
import Head from 'next/head'
import Layout from '../components/Layout'
import styles from '../styles/Home.module.css'

const GET_CUSTOMERS_SELLER = gql`
  query getCustomersBySeller {
    getCustomersBySeller {
      id
      name
      lastname
      company
      email
    }
  }
`
export default function Index() {
  const { data, loading, error } = useQuery(GET_CUSTOMERS_SELLER)

  if ( loading ) return 'Cargando...'
  return (
    <div>
      <Layout>
        <h1 className="text-2xl text-grey-800 font-light">Clientes</h1>
        <table className="table-auto shadow-md mt-10 w-full w-lg">
          <thead className="bg-gray-800">
            <tr className="text-white">
              <th className="w-1/5 py-2">Nombre</th>
              <th className="w-1/5 py-2">Empresa</th>
              <th className="w-1/5 py-2">Email</th>
            </tr>
          </thead>
          <tbody className="bg-white">
              { data.getCustomersBySeller.map( customer => (
                <tr key={customer.id}>
                  <td className="border px-4 py-2">
                    {customer.name} {customer.lastname}
                  </td>
                  <td className="border px-4 py-2">
                    {customer.company}
                  </td>
                  <td className="border px-4 py-2">
                    {customer.email}
                  </td>
                </tr>
              ))}
            </tbody>
        </table>
      </Layout>
    </div>
  )
}
