import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      {/* Blurred Background */}
      <div
        style={{
          backgroundImage: 'url("/sign_in.svg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(5px)',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: '-1',
        }}
      ></div>

      {/* SignIn Component */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
        }}
      >
        <SignIn />
      </div>
    </div>
  );
}
