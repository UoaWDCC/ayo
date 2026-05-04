import Image from 'next/image'
const VolunteersBlock = () => {
  return (
    <div className="text-black w-full">
      <div className="flex justify-center">
        <div className="text-body w-[90%] ml-10">
          <h1 className="text-heading font-semibold">Volunteer for AYO</h1>
          <div className="flex my-10">
            <Image
              className="w-sm"
              src="/volunteers.png"
              width={350}
              height={350}
              alt="Grey Rectangle"
            />
            <div className="w-lg ml-40">
              <p className="mb-3">
                The Auckland Youth Orchestra relies on the support of dedicated volunteers to help
                deliver high-quality rehearsals, concerts, and events throughout the year.
                Volunteering is a great way to get involved in the arts community, gain practical
                experience, and contribute to the success of a leading youth ensemble.
              </p>
              <p className="mb-3">
                Volunteers may assist with event coordination, audience engagement, logistics, and
                behind-the-scenes operations, playing an important role in ensuring each performance
                runs smoothly.
              </p>

              <ul className="list-disc ml-5">
                {/* could make each list item a component and map bold part and description (?) */}
                <li>
                  <span className="font-bold">Event support:</span> Assist with concert setup,
                  ushering, ticketing, and audience coordination.
                </li>
                <li>
                  <span className="font-bold">Behind-the-scenes experience:</span> Gain insight into
                  how large-scale musical events are organised and delivered
                </li>
                <li>
                  <span className="font-bold">Skill development:</span> Build transferable skills in
                  teamwork, communication, and event management.
                </li>
                <li>
                  <span className="font-bold">Flexible involvement:</span> Choose opportunities that
                  fit your availability, from one-off events to ongoing support.
                </li>
                <li>
                  <span className="font-bold">Community engagement:</span> Be part of a vibrant arts
                  community and support emerging young musicians.
                </li>
                <li>
                  <span className="font-bold">Valuable experience:</span> Strengthen your CV with
                  hands-on involvement in live events and arts organisations.
                </li>
                <li>
                  <span className="font-bold">Rewarding contribution: </span>
                  Play a meaningful role in helping bring performances to life for both musicians
                  and audiences.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VolunteersBlock
