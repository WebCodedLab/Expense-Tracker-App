import React from 'react'
import { Stats } from '../../components/Stats/Stats.jsx'
import { TableReviews as Table } from '../../components/Table/Table.jsx'
import SEO from '../../components/SEO/SEO.jsx'

const Dashboard = () => {
  return (
    <>
      <SEO 
        title="Dashboard - My Application" 
        description="Overview and statistics of the application" 
      />
      <div>
        <Table />
        <Stats />
      </div>
    </>
  )
}

export default Dashboard