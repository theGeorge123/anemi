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
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Informatie die we verzamelen</h2>
              <p className="text-gray-700 mb-4">
                We verzamelen informatie die je direct aan ons verstrekt, zoals wanneer je een meetup maakt:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Naam en e-mailadres</li>
                <li>Meetup voorkeuren (stad, budget, data)</li>
                <li>Koffie shop selecties</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Hoe we je informatie gebruiken</h2>
              <p className="text-gray-700 mb-4">
                We gebruiken de informatie die we verzamelen om:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Koffie shops voor te stellen voor je meetups</li>
                <li>Meetup uitnodigingen te versturen</li>
                <li>Onze service te verbeteren</li>
                <li>Met je te communiceren over je meetups</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Gegevensopslag</h2>
              <p className="text-gray-700 mb-4">
                Je gegevens worden veilig opgeslagen op Supabase servers in de Europese Unie, 
                conform GDPR regelgeving.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Je rechten</h2>
              <p className="text-gray-700 mb-4">
                Onder GDPR heb je het recht om:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Toegang te krijgen tot je persoonlijke gegevens</li>
                <li>Onjuiste gegevens te corrigeren</li>
                <li>Verwijdering van je gegevens aan te vragen</li>
                <li>Bezwaar te maken tegen verwerking van je gegevens</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact</h2>
              <p className="text-gray-700 mb-4">
                Als je vragen hebt over dit privacybeleid, neem dan contact met ons op via:
              </p>
              <p className="text-gray-700">
                <strong>E-mail:</strong> team@anemimeets.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
} 