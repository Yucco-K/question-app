'use client';

import { useEffect, useState } from 'react';

export default function CreateUser() {

  useEffect(() => {

    async function fetchUserCreation() {
      try {
        const response = await fetch('http://localhost:3000/api/supabase/create-user');
        if (!response.ok) {
          const errorResult = await response.json();
          console.error('Error creating user:', errorResult);
          return;
        }

        const result = await response.json();
        console.log('User created:', result);

      } catch (err) {
        console.error('Error fetching user creation API:', err);
      }
    }

    fetchUserCreation();

  }, []);


  return (
    <div className="container mx-auto px-4 py-8 h-screen flex flex-col justify-between">
      <div className="mb-4">
        <p className="text-2xl text-center">
          User creation will be attempted upon load.
        </p>
      </div>
    </div>
  );

}

