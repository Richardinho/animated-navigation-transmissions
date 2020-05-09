import React from 'react';
import { Link } from 'react-router-dom'

export function BarPage() {
  return (
    <>
      <div className="bar-page">
        <p>
         "The captain goes down with the ship" is a maritime tradition that a sea captain holds ultimate responsibility for both his ship and everyone embarked on it, and that in an emergency, he will either save them or die trying. Although often connected to the sinking of RMS Titanic in 1912 and its captain, Edward J. Smith, the tradition precedes Titanic by at least 11 years.In most instances, the captain forgoes his own rapid departure of a ship in distress, and concentrates instead on saving other people. It often results in either the death or belated rescue of the captain as the last person on board. 
    The tradition says that a captain will be the last person to leave a ship alive before its sinking or utter destruction, and if unable to evacuate the crew and passengers, the captain will not save themself even if they can.In a social context, especially as a mariner, the captain will feel compelled to take this responsibility as a social norm.
        </p>
        <p>
    In maritime law, the ship's master's responsibility for their vessel is paramount no matter what its condition, so abandoning a ship has legal consequences, including the nature of salvage rights. Therefore, even if a captain abandons their ship in distress, they are generally responsible for it in their absence and would be compelled to return to the ship until the danger to the vessel has relented. If a naval captain evacuates a vessel in wartime, it may be considered a serious crime similar to desertion, unless they subsequently return to the ship at their first opportunity to prevent its capture and rescue the crew.

            <Link to="/foo">Foo</Link>
        </p>
        <p>
    Abandoning a ship in distress may be considered a crime that can lead to imprisonment. Captain Francesco Schettino, who left his ship in the midst of the Costa Concordia disaster, was not only widely reviled for his actions, but lost his final appeal against his 16-year Italian prison sentence, including one year for abandoning his passengers, five years for causing the shipwreck, and ten years for the manslaughter of its victims. Abandoning ship is a maritime crime that has been on the books for centuries in Spain, Greece, and Italy. South Korean law may also require the captain to rescue themself last.In Finland the Maritime Law (Merilaki) states that the captain must do everything in their power to save everyone on board the ship in distress and that unless their life is in immediate danger, they shall not leave the vessel as long as there is reasonable hope that it can be saved.In the United States, abandoning the ship is not explicitly illegal, but the captain could be charged with other crimes, such as manslaughter, which encompass common law precedent passed down through centuries. It is not illegal under international maritime law.
        </p>
            <Link to="/foo">Foo</Link>
      </div>
    </>
  );
}
