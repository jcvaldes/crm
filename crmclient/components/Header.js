import React from 'react'
import { useQuery, gql } from '@apollo/client'
import { useRouter } from 'next/router';

const GET_USER = gql`
    query getUser{
        getUser {
            id
            name
            lastname
        }
    }
`;
 
const Header = () => {
  const router = useRouter();

  // query de apollo
  const { data, loading, error} = useQuery(GET_USER);
  // Proteger que no accedamos a data antes de tener resultados
  if(loading) return null;
  const { name, lastname } = data.getUser;
  return (
    <div className="sm:flex sm:justify-between mb-6">
    <p className="mr-2 mb-5 lg:mb-0">Hola: {name} {lastname}</p>

    <button 
        type="button"
        className="bg-blue-800 w-full sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white shadow-md"    
    >
        Cerrar Sesión
    </button>
</div>
  )
}

export default Header
