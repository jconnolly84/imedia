# R093 topic page uplift content, aligned to the J834 specification.
# Keys are page paths relative to the repo root.

PAGES = {

"topic-01-traditional-media.html": dict(
  ref="R093 · 1.1 Media industry sectors and products",
  spec_title="Traditional media sectors",
  spec_intro="The specification lists four traditional media sectors. For each one you should be able to say what it produces and how it is changing.",
  spec=[
    "Know the **traditional media sectors**: **film**, **television**, **radio** and **print publishing**",
    "Know the **types of products** each sector produces and uses",
    "Know how each sector is **evolving** – especially because of the internet and new media",
    "Know that the **same product** can be used by **different sectors**",
  ],
  deep=[
    dict(title="The Four Traditional Sectors",
      intro="Traditional media sectors grew up before the internet. They usually reach large audiences through one-way communication – but every one of them is changing fast.",
      features=[
        dict(img="film-crew-street", title="Film",
          paras=["The film sector makes **feature films**, documentaries and short films, plus the products that promote them: **trailers**, **posters** and **press kits**."],
          points=["**Evolving:** streaming premieres, digital cameras and projection, more **VFX** and CGI",
                  "**Same product, many sectors:** a film trailer plays in cinemas, on TV and on YouTube"]),
        dict(img="tv-studio-cameras", title="Television",
          paras=["Television produces **programmes** (drama, news, soaps, reality, sport), **adverts**, **idents** and **trailers**."],
          points=["**Evolving:** catch-up and on-demand, smart TVs, streaming services, second-screen social media",
                  "Broadcasters now publish clips on apps and social media as well as on air"]),
        dict(img="radio-show-hosts", title="Radio",
          paras=["Radio produces **live shows**, **news bulletins**, **adverts**, **jingles** and **sponsorship** messages."],
          points=["**Evolving:** digital radio (DAB), online streams, smart speakers and **podcasts**",
                  "Shows are filmed and shared as video clips on social media"]),
        dict(img="newspapers-stack", title="Print Publishing",
          paras=["Print publishing produces **newspapers**, **magazines**, **books**, **comics** and **graphic novels**, plus printed **posters** and **leaflets**."],
          points=["**Evolving:** falling print sales, **digital editions**, **eBooks**, apps and paywalled websites",
                  "Many titles are now 'digital first' with a smaller print run"]),
      ]),
    dict(title="How Traditional Media Is Changing",
      intro="The specification asks how sectors are **evolving**. The big idea is **convergence** – traditional and new media are merging.",
      cards=[
        dict(label="Distribution", title="From scheduled to on-demand", points=["Audiences watch and listen when they want", "Streaming, catch-up and podcasts replace fixed schedules"]),
        dict(label="Audience", title="From one-way to two-way", points=["Audiences comment, share and vote on social media", "Producers get instant feedback and data"]),
        dict(label="Products", title="Print to digital", points=["Newspapers and magazines publish online and in apps", "Books become eBooks and audiobooks"]),
        dict(label="Business", title="New competition", points=["Competing with YouTube, streaming and social media for attention", "Advertising money has moved online"]),
      ],
      scenario=dict(title="Example: one product, many sectors",
        paras=["A new film's **trailer** is made by the film sector, but it is shown as a **TV advert**, played before other films in the **cinema**, featured in a **magazine** review and shared on **YouTube** and **social media**.",
               "This is why exam answers should name the **product** *and* the **sector** it is being used in."])),
  ],
  terms=[
    ("Media sector", "A part of the media industry that makes a particular kind of product, e.g. film or radio."),
    ("Traditional media", "Older media sectors that existed before the internet: film, TV, radio and print publishing."),
    ("Mass media", "Media that reaches very large audiences at the same time."),
    ("One-way communication", "The audience receives the message but cannot easily respond."),
    ("Broadcast", "Sending content to a large audience at the same time, e.g. TV and radio."),
    ("Convergence", "When different media and technologies merge, e.g. a newspaper publishing video on its app."),
  ],
  do=["Name the **sector** and give a specific **product** example",
      "Explain **how** a sector is evolving, with a real example (e.g. radio → podcasts)",
      "Show that the same product can be used by more than one sector"],
  dont=["Don't say traditional media is 'dead' – it still reaches millions and is evolving",
        "Don't confuse **sectors** (e.g. television) with **products** (e.g. a TV advert)",
        "Don't give vague answers like 'it's old' – explain the impact on the audience or producer"],
),

}
