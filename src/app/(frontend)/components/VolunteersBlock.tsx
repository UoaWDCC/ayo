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
              <p>
                The Auckland Youth Orchestra relies on the support of dedicated volunteers to help
                deliver high-quality rehearsals, concerts, and events throughout the year.
                Volunteering is a great way to get involved in the arts community, gain practical
                experience, and contribute to the success of a leading youth ensemble.
              </p>
              <p>
                Volunteers may assist with event coordination, audience engagement, logistics, and
                behind-the-scenes operations, playing an important role in ensuring each performance
                runs smoothly.
              </p>

              <p>
                Event support: Assist with concert setup, ushering, ticketing, and audience
                coordination. Behind-the-scenes experience: Gain insight into how large-scale
                musical events are organised and delivered. Skill development: Build transferable
                skills in teamwork, communication, and event management. Flexible involvement:
                Choose opportunities that fit your availability, from one-off events to ongoing
                support. Community engagement: Be part of a vibrant arts community and support
                emerging young musicians. Valuable experience: Strengthen your CV with hands-on
                involvement in live events and arts organisations. Rewarding contribution: Play a
                meaningful role in helping bring performances to life for both musicians and
                audiences.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VolunteersBlock
