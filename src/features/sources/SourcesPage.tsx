import { Link } from 'react-router-dom';
import { sources } from '../../data/sources/sources';
import { Disclaimer, Panel, SourceList } from '../../components/ui';

export function SourcesPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <h1 className="font-serif text-3xl text-ink">Források és névjegy</h1>
      <Disclaimer />
      <Panel title="A MuscleLab-ról">
        <p className="text-sm leading-relaxed text-ink-2">
          A MuscleLab ingyenes, regisztráció nélküli oktatási alkalmazás fitnessinstruktor-tanulóknak, személyi edzőknek, sporttudományi hallgatóknak és minden anatómia iránt
          érdeklődőnek. Minden tananyag helyben, a böngészőben érhető el; az alkalmazás telepíthető (PWA) és internetkapcsolat nélkül is működik. Nem gyűjt személyes adatot, és nem
          használ külső API-t.
        </p>
      </Panel>
      <Panel title="Megbízhatósági szintek">
        <ul className="flex flex-col gap-1.5 text-sm text-ink">
          <li><b>Anatómiai tény</b> – tankönyvi szinten elfogadott, több forrásban egyezően leírt adat.</li>
          <li><b>Dokumentált megfigyelés</b> – egy vagy több tudományos vizsgálat eredménye (pl. EMG), amely körülményektől függhet.</li>
          <li><b>Oktatási modell</b> – egyszerűsítés a megértés érdekében (pl. 2D ábra, szerepek kiemelése).</li>
          <li><b>Ellenőrzésre vár</b> – még nem ellenőrzött információ.</li>
        </ul>
      </Panel>
      <Panel title="Anatómiai ábrák és adatforrások">
        <p className="text-sm leading-relaxed text-ink-2">
          A 2D anatómiai ábrák saját szerkesztésűek. Nyílt 3D modellkészletek (BodyParts3D – CC BY 4.0 / régebbi kiadások CC BY-SA 2.1 JP; Z-Anatomy – CC BY-SA 4.0) léteznek, de
          ezek 3D hálók, nem rétegezett, animálható 2D SVG-k. Ezek vetítése a későbbi fejlesztések része. Részletek: DATA_LICENSES.md és MODEL_LIMITATIONS.md a forráskódban.
        </p>
      </Panel>
      <Panel title="Tudományos források">
        <SourceList ids={sources.map((s) => s.id)} />
      </Panel>
      <Link to="/" className="text-sm text-accent-2 underline">
        Vissza a kezdőoldalra
      </Link>
    </div>
  );
}
