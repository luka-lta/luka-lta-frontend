import {    Outlet} from "react-router-dom";
import {Card, CardContent} from "@/components/ui/card.tsx";
import StarBackground from "@/components/StarBackground.tsx";
import {Navbar} from "@/components/Navbar.tsx";
import {Footer} from "@/components/Footer.tsx";

export default function LandingPage() {

    const getWavingHandColor = () => {
        const waving_hands = ['👋', '👋🏻', '👋🏼', '👋🏽', '👋🏾', '👋🏿'];
        const random_selector = Math.floor(Math.random() * waving_hands.length);
        return waving_hands[random_selector];
    }

    return (
        <>
            <StarBackground/>
            <Outlet/>
            <div className="flex flex-col min-h-[100dvh] bg-black">
                <Navbar/>
                <main className="flex-1 z-10">
                    <section className="w-full mt-20">
                        <div className="container px-4 md:px-6">
                            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_700px]">
                                <div className="flex flex-col justify-center space-y-4">
                                    <div className="space-y-2">
                                        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-black">
                                            Hey I'm Luka {getWavingHandColor()}
                                        </h1>
                                        <p className="max-w-[600px] text-muted-foreground bg-black md:text-xl">
                                            I'm a <strong>Fullstack</strong> Computer Engineer trainee based in Germany.
                                        </p>
                                        <p className="max-w-[600px] text-muted-foreground bg-black md:text-xl">
                                            I spend my days coding on some hobby projects, diving into games, and enjoying life’s
                                            little adventures. ;)
                                        </p>
                                        <p className="max-w-[600px] text-muted-foreground bg-black md:text-xl">
                                            On this corner of the web, I will host & present a small variety of my services and personal hobby projects.
                                        </p>
                                    </div>
                                </div>
                                <img
                                    draggable="false"
                                    // src="/static/media/images/splash_hey_2.png"
                                    alt="Splash Pic"
                                    className="mx-auto overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
                                />
                            </div>
                        </div>
                    </section>
                    <section id="projects" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
                        <div className="container px-4 md:px-6">
                            <div className="flex flex-col items-center justify-center space-y-4 text-center">
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">My Projects</h2>
                                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                        Here are some of my projects that I have worked on
                                    </p>
                                </div>
                            </div>
                            <div className="mx-auto grid max-w-8xl grid-cols-1 gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
                                <Card className="rounded-2xl">
                                    <CardContent className="flex flex-col gap-3">
                                        <img
                                            draggable="false"
                                            // src="/static/media/images/mandelbrot.jpg"
                                            alt="ByteBuddy Icon"
                                            className="aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
                                        />
                                        <div className="flex flex-col gap-2">
                                            <h3 className="text-xl font-bold">ByteBuddy</h3>
                                            <p className="text-muted-foreground">An Discord moderation bot</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="flex flex-col gap-3">
                                        <img
                                            draggable="false"
                                            // src="/static/icons/placeholder.svg"
                                            alt="TaskWave Icon"
                                            className="aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
                                        />
                                        <h3 className="text-xl font-bold">TaskWave </h3>
                                        <p className="text-muted-foreground">An open-source Task management tool!</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </section>
                    <section id="skills" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
                      <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                          <div className="space-y-2">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">My Skills</h2>
                            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                              Here are some of my technical and soft skills.
                            </p>
                          </div>
                        </div>
                        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
                          <Card>
                            <CardContent className="flex flex-col gap-2">
                              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Coding Skills</div>
                              <ul className="list-disc pl-4 space-y-2">
                                <li>React.js</li>
                                <li>JavaScript</li>
                                <li>TypeScript</li>
                                <li>HTML/CSS</li>
                                <li>Node.js</li>
                                <li>Git</li>
                              </ul>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="flex flex-col gap-2">
                              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Softskills</div>
                              <ul className="list-disc pl-4 space-y-2">
                                <li>Teamarbeit</li>
                                <li>Kommunikation</li>
                                <li>Problemlösung</li>
                                <li>Kreativität</li>
                                <li>Lernbereitschaft</li>
                              </ul>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </section>
                    {/*<section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-muted">*/}
                    {/*  <div className="container px-4 md:px-6">*/}
                    {/*    <div className="flex flex-col items-center justify-center space-y-4 text-center">*/}
                    {/*      <div className="space-y-2">*/}
                    {/*        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Kontakt</h2>*/}
                    {/*        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">*/}
                    {/*          Fühlen Sie sich frei, mich über das Kontaktformular zu erreichen.*/}
                    {/*        </p>*/}
                    {/*      </div>*/}
                    {/*      <div className="mx-auto w-full max-w-sm space-y-2">*/}
                    {/*        <form className="flex flex-col gap-4">*/}
                    {/*          <Input type="text" placeholder="Name" className="max-w-lg flex-1" />*/}
                    {/*          <Input type="email" placeholder="E-Mail" className="max-w-lg flex-1" />*/}
                    {/*          <Textarea placeholder="Nachricht" className="max-w-lg flex-1" />*/}
                    {/*          <Button type="submit">Senden</Button>*/}
                    {/*        </form>*/}
                    {/*      </div>*/}
                    {/*    </div>*/}
                    {/*  </div>*/}
                    {/*</section>*/}
                </main>
                <Footer/>
            </div>
        </>
    )
}