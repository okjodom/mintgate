import React from 'react';
import { Header, FederationCard } from './components';
import { Federation } from './federation.types';
import { data } from './federation.data';


export const Admin = React.memo(() => {
  return (
    <div className="App">
      <main style={wrapperStyles}>
        <Header />
        <section style={federationsListStyles}>
          {
            data.federations.map((federation: Federation) => {
              return <FederationCard
                        key={federation.mint_pubkey}
                        federation={federation}
                        onClick={() => console.log("clicked")}
                      />
            })
          }
        </section>
      </main>
    </div>
  );
});

const wrapperStyles = {
  margin: 32,
}

const federationsListStyles = {
  paddingTop: 24,
  display: "flex",
  flexDirection: "column" as "column",
  gap: 24,
}
