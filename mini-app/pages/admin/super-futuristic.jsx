import React from 'react';
import { GetServerSideProps } from 'next';
import SuperFuturisticDashboard from '../../components/SuperFuturisticDashboard';

export default function SuperFuturisticAdminPage() {
  return <SuperFuturisticDashboard />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {}, // will be passed to the page component as props
  };
};
