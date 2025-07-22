export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-background rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-foreground mb-6">Gebruiksvoorwaarden</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-muted-foreground mb-6">
              <strong>Laatst bijgewerkt:</strong> {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Aanvaarding van voorwaarden</h2>
              <p className="text-muted-foreground mb-4">
                Door Anemi Meets te gebruiken, ga je akkoord met deze Gebruiksvoorwaarden. 
                Als je niet akkoord gaat met deze voorwaarden, gebruik dan onze service niet.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Service beschrijving</h2>
              <p className="text-muted-foreground mb-4">
                Anemi Meets is een platform dat je helpt koffie shops te ontdekken en meetups te organiseren. 
                We geven koffie shop suggesties op basis van je voorkeuren en faciliteren meetup uitnodigingen.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Gebruikersverantwoordelijkheden</h2>
              <p className="text-muted-foreground mb-4">
                Je gaat akkoord met:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mb-4">
                <li>Nauwkeurige en volledige informatie te verstrekken</li>
                <li>De privacy en rechten van andere gebruikers te respecteren</li>
                <li>De service niet te gebruiken voor illegale of schadelijke doeleinden</li>
                <li>Niet te proberen onbevoegde toegang tot onze systemen te krijgen</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Aansprakelijkheidsbeperking</h2>
              <p className="text-muted-foreground mb-4">
                Anemi Meets wordt geleverd &quot;zoals het is&quot; zonder garanties van welke aard dan ook. 
                We zijn niet verantwoordelijk voor problemen die kunnen ontstaan tijdens meetups 
                of interacties tussen gebruikers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Wijzigingen in voorwaarden</h2>
              <p className="text-muted-foreground mb-4">
                We kunnen deze voorwaarden van tijd tot tijd bijwerken. We zullen gebruikers 
                op de hoogte stellen van belangrijke wijzigingen via e-mail of via de service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Contactgegevens</h2>
              <p className="text-muted-foreground mb-4">
                Voor vragen over deze voorwaarden, neem contact met ons op via:
              </p>
              <p className="text-muted-foreground">
                <strong>E-mail:</strong> team@anemimeets.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 