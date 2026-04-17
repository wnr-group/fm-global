import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'FM Global Careers - Building Global Oil & Gas Careers';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0f385a 0%, #0b1b2b 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '4px',
              background: 'rgba(255,255,255,0.4)',
            }}
          />
          <span
            style={{
              fontSize: '18px',
              color: 'rgba(255,255,255,0.6)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            FM Global Careers
          </span>
        </div>
        <h1
          style={{
            fontSize: '72px',
            color: 'white',
            lineHeight: 1.1,
            fontWeight: 700,
            marginBottom: '24px',
          }}
        >
          Building Global
          <br />
          Oil & Gas Careers
        </h1>
        <p
          style={{
            fontSize: '24px',
            color: 'rgba(255,255,255,0.7)',
            maxWidth: '600px',
            lineHeight: 1.5,
          }}
        >
          Industry-focused training and international placement across global markets.
        </p>
      </div>
    ),
    {
      ...size,
    }
  );
}
