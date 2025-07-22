export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacybeleid</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Laatst bijgewerkt:</strong> {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Informatie die we verzamelen</h2>
              <p className="text-gray-700 mb-4">
                We verzamelen informatie die je direct aan ons verstrekt, zoals wanneer je een meetup maakt:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Naam en e-mailadres (voor account en communicatie)</li>
                <li>Meetup voorkeuren (stad, budget, data, tijden)</li>
                <li>Koffie shop selecties en interacties</li>
                <li>Technische gegevens (IP-adres, browser type, apparaat informatie)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Hoe we je informatie gebruiken</h2>
              <p className="text-gray-700 mb-4">
                We gebruiken de informatie die we verzamelen om:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Koffie shops voor te stellen voor je meetups</li>
                <li>Meetup uitnodigingen te versturen</li>
                <li>Onze service te verbeteren en te onderhouden</li>
                <li>Met je te communiceren over je meetups</li>
                <li>Technische problemen op te lossen</li>
                <li>Onze service te beveiligen</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Gegevensopslag en beveiliging</h2>
              <p className="text-gray-700 mb-4">
                Je gegevens worden veilig opgeslagen op Supabase servers in de Europese Unie, 
                conform GDPR regelgeving. We implementeren passende technische en organisatorische 
                maatregelen om je gegevens te beschermen tegen ongeautoriseerde toegang, wijziging, 
                openbaarmaking of vernietiging.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Cookies en tracking</h2>
              <p className="text-gray-700 mb-4">
                We gebruiken cookies om je ervaring te verbeteren en onze service te analyseren. 
                Je kunt cookies weigeren, maar dit kan de functionaliteit van onze website beïnvloeden.
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Essentiële cookies:</strong> Nodig voor basis functionaliteit</li>
                <li><strong>Analytische cookies:</strong> Om service gebruik te begrijpen</li>
                <li><strong>Preferentie cookies:</strong> Om je instellingen te onthouden</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Je GDPR rechten</h2>
              <p className="text-gray-700 mb-4">
                Onder GDPR heb je de volgende rechten:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Toegang:</strong> Je hebt het recht om toegang te krijgen tot je persoonlijke gegevens</li>
                <li><strong>Rectificatie:</strong> Je kunt onjuiste gegevens corrigeren</li>
                <li><strong>Vergetelheid:</strong> Je kunt verwijdering van je gegevens aanvragen</li>
                <li><strong>Beperking:</strong> Je kunt beperking van verwerking aanvragen</li>
                <li><strong>Portabiliteit:</strong> Je kunt je gegevens in een gestructureerd formaat ontvangen</li>
                <li><strong>Bezwaar:</strong> Je kunt bezwaar maken tegen verwerking van je gegevens</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Gegevensverwerking en derden</h2>
              <p className="text-gray-700 mb-4">
                We delen je gegevens niet met derden, behalve:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Met je expliciete toestemming</li>
                <li>Wanneer wettelijk verplicht</li>
                <li>Met service providers die ons helpen de service te leveren (zoals Supabase)</li>
                <li>Voor beveiliging en fraudebestrijding</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Gegevensretentie</h2>
              <p className="text-gray-700 mb-4">
                We bewaren je gegevens zolang je account actief is of zolang nodig is om onze 
                service te leveren. Je kunt je account en alle gegevens op elk moment verwijderen 
                via je account instellingen of door contact met ons op te nemen.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Contact en klachten</h2>
              <p className="text-gray-700 mb-4">
                Als je vragen hebt over dit privacybeleid of je rechten wilt uitoefenen, 
                neem dan contact met ons op:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <strong>E-mail:</strong> team@anemimeets.com
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Adres:</strong> [Jouw bedrijfsadres in EU]
                </p>
                <p className="text-gray-700">
                  <strong>DPO:</strong> [Data Protection Officer contactgegevens]
                </p>
              </div>
              <p className="text-gray-700 mt-4">
                Je hebt ook het recht om een klacht in te dienen bij de Autoriteit Persoonsgegevens 
                als je van mening bent dat we je rechten niet respecteren.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
} 