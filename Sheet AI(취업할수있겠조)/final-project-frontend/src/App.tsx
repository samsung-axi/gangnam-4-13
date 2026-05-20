// src/app/App.tsx
import PageRouter from '@/shared/components/PageRouter.tsx';
import { Provider } from 'jotai';
import AuthInitializer from '@/shared/components/AuthInitializer';

function App() {
  return (
    <Provider>
      <AuthInitializer>
        <div className="w-screen h-screen">
          <PageRouter />
        </div>
      </AuthInitializer>
    </Provider>
  );
}

export default App;



// import PageRouter from '@/shared/components/PageRouter.tsx';


// function App() {
//   return (
//     <div className='w-screen h-screen'>
//       <PageRouter />
//     </div>
//   );
// }

// export default App;
