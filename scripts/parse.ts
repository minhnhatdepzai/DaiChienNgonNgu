import fs from 'fs';

const raw1A = `
1. We ___ American.
A) not
B) not are
C) aren’t
D) isn’t
2. ___ this magazine before?
A) Do you read
B) Are you going to read
C) Are you reading
D) Have you read
3. This is our new teacher. ___ name is Mark.
A) His
B) Her
C) Its
D) He
4. He ___ the newspaper every day.
A) read
B) reads
C) doesn’t reads
D) don’t reads
5. Is Mont Blanc ___ mountain in Europe?
A) the higher
B) the most highest
C) the more high
D) the highest
6. British people ___ tea with milk.
A) to drink
B) drink
C) drinks
D) are drink
7. ___ you like Chinese food?
A) Do
B) Does
C) Are
D) Is
8. It’s my ___ computer.
A) parents
B) parents’
C) parent
D) parent’s
9. Could we ___ the bill, please?
A) take
B) want
C) have
D) ask
10. The people ___ in room 12.
A) is
B) am
C) are
D) be
11. It’s ten ___ seven.
A) to
B) for
C) at
D) in
12. I ___ to classical music.
A) never to listen
B) listen never
C) never listen
D) don’t never listen
13. Would you like ___ coffee?
A) other
B) another
C) some other
D) more one
14. I haven’t ___ this photo before.
A) see
B) saw
C) to see
D) seen
15. I can’t see. Where are my ___?
A) glasses
B) stamps
C) keys
D) lipsticks
16. I like ___ in the morning.
A) that I work
B) working
C) work
D) to be work
17. Thanks for ___.
A) all
B) the all
C) everything
D) all things
18. ‘Was Debussy from France?’ ‘Yes, ___.’
A) he were
B) was
C) there were
D) he was
19. I’m Italian. ___ family are from Venice.
A) Our
B) My
C) Her
D) Me
20. What ___ do tomorrow?
A) are you going
B) you going
C) are you going to
D) do you go to
21. Can I pay ___ credit card?
A) by
B) in
C) on
D) with
22. This isn’t my money. It’s ___.
A) to you
B) the yours
C) your
D) yours
23. Tonight’s dinner is ___ than last night’s.
A) more good
B) gooder
C) better
D) more better
24. They’re ___.
A) bigs cars
B) cars bigs
C) big cars
D) bigs car
25. They didn’t ___ the tickets.
A) booking
B) booked
C) to book
D) book
26. ___ the time?
A) What’s
B) What is it
C) What
D) What it is
27. She ___ to the gym every day.
A) gets
B) goes
C) has
D) does
28. I ___ do my homework last night.
A) not could
B) didn’t can
C) couldn’t
D) can’t
29. There ___ telephone in my hotel room.
A) wasn’t a
B) weren’t a
C) weren’t any
D) wasn’t some
30. He ___ playing the piano.
A) are
B) does
C) is
D) has
31. He ___ jeans.
A) doesn’t usually wear
B) isn’t usually wearing
C) wears usually
D) doesn’t wear usually
32. I ___ my new job last week.
A) have begun
B) began
C) am begin
D) begin
33. There isn’t ___ pasta in the kitchen.
A) some
B) many
C) a
D) any
34. She ___ to cook for her boyfriend.
A) isn’t going
B) isn’t go
C) aren’t going
D) doesn’t go
35. The elephant is ___ land animal in the world.
A) the bigger
B) the most big
C) biggest
D) the biggest
36. ___ yesterday?
A) You studied
B) Did you studied
C) Did you study
D) Studied you
37. James would like ___ basketball.
A) playing
B) to play
C) play
D) to playing
38. I always ___.
A) work hard
B) hard work
C) hardly work
D) work hardly
39. We ___ to Canada.
A) haven’t be
B) hasn’t been
C) hasn’t be
D) haven’t been
40. He ___ follow instructions.
A) doesn’t can
B) not can
C) isn’t can
D) can’t
Answer Key:
1: C
2: D
3: A
4: B
5: D
6: B
7: A
8: B
9: C
10: C
11: A
12: C
13: B
14: D
15: A
16: B
17: C
18: D
19: B
20: C
21: A
22: D
23: C
24: C
25: D
26: A
27: B
28: C
29: A
30: C
31: A
32: B
33: D
34: A
35: D
36: C
37: B
38: A
39: D
40: D
`;

const raw1B = `
1. I can’t see. Where are my ___?
A) glasses
B) stamps
C) keys
D) lipsticks
2. He ___ the newspaper every day.
A) read
B) doesn’t reads
C) reads
D) don’t reads
3. ‘Was Picasso from Spain?’ ‘Yes, ___.’
A) he were
B) was
C) there were
D) he was
4. ___ you like Italian food?
A) Do
B) Does
C) Are
D) Is
5. I ___ do my homework last night.
A) not could
B) didn’t can
C) couldn’t
D) can’t
6. She ___ to cook for her parents.
A) isn’t going
B) isn’t go
C) aren’t going
D) doesn’t go
7. ___ this book before?
A) Do you read
B) Are you going to read
C) Are you reading
D) Have you read
8. I’m Japanese. ___ family are from Tokyo.
A) Our
B) My
C) Her
D) Me
9. I ___ to pop music.
A) never to listen
B) listen never
C) never listen
D) don’t never listen
10. Thanks for ___.
A) all
B) the all
C) everything
D) all things
11. Can I pay ___ credit card?
A) by
B) in
C) on
D) with
12. Simon would like ___ basketball.
A) playing
B) to play
C) play
D) to playing
13. Today’s breakfast is ___ than yesterday's.
A) more good
B) gooder
C) better
D) more better
14. What ___ do tomorrow?
A) are you going
B) are you going to
C) you going
D) do you go to
15. This isn’t my umbrella. It’s ___.
A) to you
B) the yours
C) your
D) yours
16. They’re ___.
A) bigs cars
B) cars bigs
C) big cars
D) bigs car
17. It’s my ___ dog.
A) parents
B) parents’
C) parent
D) parent’s
18. ___ the time?
A) What’s
B) What is it
C) What
D) What it is
19. British people ___ tea with milk.
A) to drink
B) drink
C) drinks
D) are drink
20. She ___ to the market every day.
A) gets
B) has
C) goes
D) does
21. There ___ telephone in my hotel room.
A) wasn’t a
B) weren’t a
C) weren’t any
D) wasn’t some
22. He ___ glasses.
A) doesn’t usually wear
B) isn’t usually wearing
C) wears usually
D) doesn’t wear usually
23. He ___ follow instructions.
A) doesn’t can
B) not can
C) isn’t can
D) can’t
24. I ___ my new job last month.
A) have begun
B) began
C) am begin
D) begin
25. He ___ playing the guitar.
A) are
B) does
C) is
D) has
26. Could we ___ the bill, please?
A) take
B) want
C) have
D) ask
27. There isn’t ___ bread in the kitchen.
A) some
B) many
C) a
D) any
28. We ___ to Mexico.
A) haven’t be
B) haven’t been
C) hasn’t be
D) hasn’t been
29. The elephant is ___ land animal in the world.
A) the bigger
B) the most big
C) biggest
D) the biggest
30. I always ___.
A) work hard
B) hard work
C) hardly work
D) work hardly
31. Is Mount Everest ___ mountain in the world?
A) the higher
B) the most highest
C) the more high
D) the highest
32. ___ yesterday?
A) You studied
B) Did you study
C) Did you studied
D) Studied you
33. The people ___ in room 5.
A) is
B) am
C) are
D) be
34. This is our new teacher. ___ name is Charles.
A) His
B) Her
C) Its
D) He
35. We ___ Scottish.
A) not
B) not are
C) aren’t
D) isn’t
36. I like ___ in the evening.
A) that I work
B) working
C) work
D) to be work
37. It’s ten ___ nine.
A) to
B) for
C) at
D) at
38. Would you like ___ drink?
A) other
B) another
C) some other
D) more one
39. They didn’t ___ the tickets.
A) booking
B) booked
C) to book
D) book
40. I haven’t ___ this picture before.
A) seen
B) saw
C) to see
D) see
Answer Key:
1: A
2: C
3: D
4: A
5: C
6: A
7: D
8: B
9: C
10: C
11: A
12: B
13: C
14: B
15: D
16: C
17: B
18: A
19: B
20: C
21: A
22: A
23: D
24: B
25: C
26: C
27: D
28: B
29: D
30: A
31: D
32: B
33: C
34: A
35: C
36: B
37: A
38: B
39: D
40: A
`;

const raw2A = `
1. It ___ when they went out.
A) has rained
B) was raining
C) is raining
D) was to rain
2. Did you ___ TV last night?
A) watch
B) see
C) look at
D) listen
3. That’s the hotel ___ we had lunch.
A) what
B) where
C) that
D) which
4. Diana ___ some wine when she went to France.
A) bought
B) buyed
C) boot
D) did buy
5. I don’t get ___ very well with my brother.
A) by
B) from
C) on
D) to
6. Tom always ___ golf on Sundays.
A) plays
B) play
C) play
D) is plays
7. Mary ___ a key when she was cleaning her car.
A) was finding
B) finded
C) founded
D) found
8. ___ I worked hard, I didn’t pass the test.
A) Although
B) So
C) Because
D) But
9. My parents ___ to stay with us next week.
A) comes
B) coming
C) is coming
D) are coming
10. Come on, it’s time ___.
A) to go
B) going
C) we go
D) go
11. Can you look ___ my dog this weekend?
A) with
B) away
C) up
D) after
12. Who ___ the answer to this question?
A) knows
B) know
C) does know
D) does knows
13. When I got to work I remembered that ___ my mobile
at home.
A) I’d leave
B) I was leaving
C) I’d left
D) I left
14. My father ___ be a builder.
A) used to
B) was
C) use to
D) did use to
15. I haven’t tidied my office ___.
A) just
B) already
C) yet
D) since
16. I can sing, but not as ___ as my sister.
A) well
B) good
C) best
D) better
17. That’s my money! Give ___!
A) back
B) it back
C) back it
D) it
18. Richard isn’t very good ___.
A) to dance
B) at dancing
C) dancing
D) dance
19. I’m sure Canada isn’t as big ___ Russia.
A) as
B) than
C) to
D) like
20. It’s important ___ too much alcohol.
A) not to drinking
B) not to drink
C) not drink
D) not drinks
21. We ___ take a map.
A) should
B) should to
C) might to
D) might
22. ___ dinner in a restaurant today.
A) I have
B) I having
C) I’m having
D) I’m to have
23. Cameras aren’t allowed here – you ___ take photos.
A) mustn’t
B) don’t have to
C) must not to
D) have to
24. Pam ___ eat cheese, but she does now.
A) didn’t used to
B) did use to
C) didn’t use to
D) wasn’t to
25. We ___ late and the game had already started.
A) arrived
B) had arrived
C) didn’t arrive
D) were arriving
26. Your diet is terrible. You don’t eat _______.
A) many vegetables
B) enough vegetables
C) vegetables enough
D) many vegetable
27. If we had the money, we ___ get a taxi.
A) will can
B) can
C) would can
D) could
28. ___ my best friend since 1999.
A) I’ve known
B) I knew
C) I’m knowing
D) I know
29. You ___ the new café in town. The coffee’s terrible.
A) aren’t like
B) won’t like
C) isn’t like
D) won’t liking
30. There’s always a lot of traffic going ___ the bridge.
A) over
B) in
C) at
D) through
31. This road was built ___ the Romans.
A) of
B) for
C) by
D) with
32. Michelangelo ___ some of his best works in Rome.
A) painted
B) was painted
C) is painting
D) has painted
33. You eat ___ chocolate – you really should give up.
A) too much
B) enough
C) very many
D) much
34. How ___ your name?
A) is it pronounced
B) you pronounce
C) do you pronounce
D) to pronounce
35. I ___ come to the party tonight.
A) might not
B) b don’t might
C) don’t to
D) not
36. I’m really tired – I only got ___ hours’ sleep.
A) not many
B) a few
C) a little
D) few
37. Your papers are on the floor. Why don’t you ___?
A) pick them up
B) pick up them
C) pick up to them
D) pick them
38. If you take your time, ___ the right decision.
A) you make
B) you’d make
C) you'll make
D) you’re making
39. I ___ the museum because I hadn’t brought a map.
A) couldn’t find
B) couldn’t to find
C) can’t find
D) hadn’t found
40. She told me ___ number, but I can’t remember it.
A) my
B) his
C) her
D) hers
Answer Key:
1: B
2: A
3: B
4: A
5: C
6: A
7: D
8: A
9: D
10: A
11: D
12: A
13: C
14: A
15: C
16: A
17: B
18: B
19: A
20: B
21: A
22: C
23: A
24: C
25: A
26: B
27: D
28: A
29: B
30: A
31: C
32: A
33: A
34: C
35: A
36: B
37: A
38: C
39: A
40: C
`;

const rawB2 = `
1. I __________ to be picking Tom up at the station but
I’ve lost my keys.
A) am supposed
B) am requested
C) am intended
D) am obliged
2. How about going to Colours nightclub? There’s no
__________ I’m going there. It’s awful!
A) hope
B) way
C) time
D) opportunity
3. By the age of 18,I __________ not to go to university.
A) had decided
B) decided
C) have decided
D) was deciding
4. I’m afraid your car __________ repaired before next
week.
A) hasn’t been
B) wasn’t
C) wouldn’t be
D) can’t be
5. The amount of organically grown food on sale has
__________ enormously in recent years.
A) raised
B) lifted
C) increased
D) built
6. Can you believe it? A woman has been __________ for
hacking into the computer of her online virtual
husband.
A) accused
B) suspended
C) arrested
D) suspected
7. You may borrow my laptop __________ you promise to
look after it.
A) unless
B) in case
C) as long as
D) although
8. It’s a huge painting. It __________ taken ages to
complete.
A) must have
B) can’t have
C) should have
D) won’t have
9. Pierre tends to put __________ dealing with problems,
rather than dealing with them immediately.
A) down
B) off
C) over
D) away
10. If the taxi hadn’t stopped for us, we __________
standing in the rain.
A) were still
B) would still be
C) are still
D) will still be
11. My mother’s Italian, so __________ the language has
been quite easy for me.
A) to learn
B) learn
C) having learned
D) learning
12. __________ I had the talent, I still wouldn’t want to be
a movie star.
A) In case
B) Even if
C) Provided that
D) However much
13. The factory workers threatened __________ on strike if
they didn’t get a pay rise.
A) going
B) to go
C) that they go
D) to have gone
14. I was about to go to sleep when it __________ to me
where the missing keys might be.
A) remembered
B) happened
C) appeared
D) occurred
15. There’s going to be a new department at work.
They’ve asked me to __________ it up.
A) take
B) set
C) put
D) bring
16. If the film is a __________ success, the director will get
most of the credit.
A) big
B) high
C) large
D) good
17. By the end of today’s seminar I will __________ to each
of you individually.
A) speak
B) have spoken
C) be speaking
D) have been speaking
18. This is a photo of my little sister __________ ice cream
on the beach.
A) eat
B) eating
C) was eating
D) having eaten
19. Our students take their responsibilities very
__________ .
A) considerably
B) thoroughly
C) seriously
D) strongly
20. Piawas _____ delighted with the birthday present.
A) very
B) completely
C) fairly
D) absolutely
Answer Key:
1: A
2: B
3: A
4: D
5: C
6: C
7: C
8: A
9: B
10: B
11: D
12: B
13: B
14: D
15: B
16: A
17: B
18: B
19: C
20: D
`;

const rawC1 = `
1. People were amazed that the burglary took place in
_____ daylight.
A) wide
B) broad
C) large
D) open
2. She invested a lot of time _____ researching the most
appropriate university course.
A) to
B) for
C) with
D) in
3. The police claimed that they acted in self _____
.
A) interest
B) confidence
C) defence
D) discipline
4. I _____ remember putting my briefcase down on that
shelf.
A) deeply
B) entirely
C) clearly
D) strongly
5. He turned _____ to be considerably older than 1 had
imagined.
A) over
B) up
C) out
D) round
6. The windows in this house are in urgent _____ of
replacement.
A) need
B) help
C) want
D) demand
7. Speed cameras _____ shown to reduce accidents.
A) have
B) were being
C) have been
D) are being
8. Life is a _____ deal easier for immigrants who can
speak the local language.
A) far
B) huge
C) big
D) great
9. The experiment _____ testing people’s responses
before and after drinking coffee.
A) contained
B) incorporated
C) involved
D) consisted
10. We may be a bit late. We’re _____ in a traffic jam.
A) buried
B) stuck
C) blocked
D) surrounded
11. Having _____ his driving test several times, Paul
finally passed at the fourth attempt.
A) taken
B) made
C) had
D) attended
12. Gospel music has been a major influence _____ other
musical styles, especially soul.
A) with
B) to
C) about
D) on
13. Maintaining an accurate balance sheet is essential.
_____ business you’re in.
A) however
B) wherever
C) whatever
D) whenever
14. It’s _____ likely that this novel will win a literary prize.
A) totally
B) deeply
C) strongly
D) highly
15. It’s no __________ for me to get Brad’s phone number
- I’ll be seeing him tonight.
A) point
B) wonder
C) secret
D) problem
16. I’d lived in Australia, so I was used to __________ on
the left side of the road.
A) driving
B) drive
C) having driven
D) drove
17. I don’t think the colours in Julia’s outfit _____ together.
A) fit
B) suit
C) match
D) go
18. Very rarely _____ here in July.
A) it rains
B) does it rain
C) is it raining
D) it is raining
19. I prefer to buy CDs __________ download music from
my computer.
A) in contrast to
B) as opposed to
C) rather than
D) in comparison to
20. The number of turtles on the island __________ by
70% over the last decade.
A) has declined
B) has been declining
C) has been declined
D) is declining
Answer Key:
1: B
2: D
3: C
4: C
5: C
6: A
7: C
8: D
9: C
10: B
11: A
12: D
13: C
14: D
15: D
16: A
17: D
18: B
19: C
20: A
`;

const rawC2Test1 = `
1. ______, he always has difficulty in making ends meet.
A) How much work he takes on
B) How he takes on a lot of work
C) How much work does he take on
D) However much work he takes on
2. Since the law works so slowly, there is a considerable
______ of cases waiting for trial.
A) remainder
B) hangover
C) backlog
D) reserve
3. Hardly ______ under the shower when the phone rang.
A) had he got
B) he has got
C) he got
D) he was getting
4. They don’t work the same shift any longer, but they
still meet ______ in the canteen.
A) in time
B) at the same time
C) from time to time
D) on time
5. The more he does for her, ______.
A) she seems dissatisfied
B) the more dissatisfied she seems
C) she’s seeming dissatisfied
D) she seems more dissatisfied
6. You had nothing better to do. You ______ a hand with
moving the furniture!
A) would have given
B) had to give
C) should give
D) might have given
7. By the time she realizes what’s going on, the little
money they’ve managed to save over the years
______ on another woman.
A) will have spent
B) will have been spent
C) is spending
D) has been spent
8. If his boss ______ him telling a competitor about their
new products, he would still have a job.
A) hadn’t caught
B) wouldn’t have caught
C) didn’t catch
D) wouldn’t catch
9. ______ my colleagues, I would like to thank you for
everything you have done for us.
A) On behalf of
B) Instead of
C) In spite of
D) On account of
10. Can you give me a rough ______ of what the job might
cost me?
A) calculating
B) value
C) estimate
D) esteem
11. He’d hate to work in an office. He’d prefer a job that
allowed him to spend most of his time ______.
A) in air
B) off limits
C) in open
D) out of doors
12. ______ for her support and help, he would have given
up years ago.
A) Unless it was
B) Had it not been
C) If she hadn’t been
D) If it were
13. Don’t you like it? I was ______ you liked Indian food.
A) off the idea
B) thinking
C) in response to
D) under the impression
14. The article you want is ______ It should take about
twenty working days to arrive. Shall I order it for you?
A) out of sale
B) out of stock
C) on order
D) in stock
15. He is well ______ of the problems involved in setting
up a business.
A) acquainted
B) knowledgeable
C) learned
D) aware
16. She seems a lively, fun-loving person, but it would be
a great mistake to ______ her intelligence.
A) underrate
B) despise
C) depreciate
D) devalue
17. Your name ______ up in the course of our
conversation.
A) brought
B) came
C) got
D) took
18. Those trainers have ______. Why don’t you get a new
pair?
A) gone off
B) expired
C) dropped off
D) seen better days
19. She wasn’t helped. She did it ______.
A) off-hand
B) with slight of hand
C) single-handed
D) with one hand
20. You’re living in a world of make-believe! You’ll have to
______ up to facts sooner or later.
A) come
B) bring
C) look
D) face
21. They treated you very badly. Aren’t you tempted to
______ in some way?
A) win them again
B) go round the bend
C) get your own back
D) give them back
22. It’s a formal wedding, so my husband and I will have
to ______.
A) get dressed
B) dress up
C) wear our birthday suits
D) wear dresses
23. She ______ a rage when she saw the mess they’d
made.
A) flew into
B) went off
C) blew up
D) came into
24. She never comes here now. We only see her ______.
A) when the cows come home
B) once in a blue moon
C) time and time again
D) once upon a time
25. The news of the robbery soon ______.
A) broke out
B) came over
C) spread out
D) got round
26. John’s doctor says he is ______ a nervous breakdown.
A) closed to
B) on edge
C) nearby
D) on the verge of
27. One little mistake shouldn’t ______ again.
A) stop you to try
B) put you off trying
C) prevent you to try
D) get you off
28. I thought her behaviour was very out of ______.
A) mind
B) personality
C) character
D) role
Answer Key:
1: D
2: C
3: A
4: C
5: B
6: D
7: B
8: A
9: A
10: C
11: D
12: B
13: D
14: B
15: D
16: A
17: B
18: D
19: C
20: D
21: C
22: B
23: A
24: B
25: D
26: D
27: B
28: C
`;

const rawC2Test2 = `
1. _____, don’t tell anybody about our plans for a
merger.
A) However you do
B) What thing you do
C) Whatever you do
D) Whichever to do
2. The thought of spending a night in the so-called
‘haunted’ house alone made him ____ with fear.
A) burp
B) shudder
C) blink
D) swallow
3. ____ that they booed her off the stage.
A) She sang such badly
B) So badly she sang
C) So she sang badly
D) So badly did she sing
4. Well, you finally managed to get here; it’s ____ time!
A) excessive
B) about
C) over
D) more than
5. _____ at home, she left a note on the front door.
A) Realising there was nobody
B) By realising nobody was
C) Realised nobody was
D) On realised there wasn’t anybody
6. I don’t know where he is; he ____ over an hour ago.
A) could arrive
B) might be arrived
C) should have arrived
D) must have arrived
7. What are the chances they ____ the job by Friday?
A) will have been finishing
B) are finishing
C) are going to be finished
D) will have finished
8. If you ____, drop in for a chat.
A) will be passing
B) should happen to be passing
C) happened to pass
D) have passed
9. There have been a few complaints but ____ our
customers are satisfied.
A) above all
B) no matter how
C) by and large
D) within reason
10. As this is only a reproduction of the original painting,
it is practically ___.
A) priceless
B) worthless
C) invaluable
D) unworthy
11. He promised to stick by her through ___.
A) spick and span
B) odds and ends
C) thick and thin
D) bad and good
12. ____ for him, we surely would have missed our flight.
A) Unless we waited
B) Had we waited any longer
C) If we were to wait
D) Should we wait
13. Matters finally ____ at the office and they fired him.
A) hit the roof
B) tore off a strip
C) brought to a boil
D) came to a head
14. When they speak about physics, I’m afraid it’s all
over ____.
A) my brain
B) my schooling
C) my head
D) my knowledge
15. The shirt looks small but the material ____ to fit the
individual.
A) swells
B) stretches
C) spreads
D) extends
16. When he turned on the tap, the water ____ out and
soaked the front of his trousers.
A) dripped
B) spurted
C) trickled
D) oozed
17. They hadn’t _____ there being so much traffic and
missed their plane.
A) caught on
B) dreamed up
C) bargained on
D) set out
18. The conference was going well until a new manager
gave a speech that was _______ and boring.
A) loose-lipped
B) off the order
C) overtime
D) long-winded
19. The holiday didn’t ____ to their expectations.
A) come up
B) get down
C) bring up
D) come down
20. I’m afraid Joe is _____ of a nervous breakdown.
A) on the blink
B) under jeopardy
C) on the verge
D) from scratch
21. We’ll have to ______ the many candidates and see
who is the most suited for the job.
A) strip down
B) see through
C) sift through
D) take away
22. After losing the contract, the company decided to
____ on inefficiency.
A) make up
B) get rid
C) come down
D) crack down
23. At the moment, there is little ____ of the manager
resigning.
A) means
B) trace
C) probably
D) likelihood
24. Their state-of-the-art website ____ thinking it was a
reputable company.
A) fooled us into
B) put us over
C) caused us to
D) brought us into
25. Mark suddenly started insulting the customer. It was
so out of ____ that everybody was shocked!
A) role
B) bounds
C) character
D) personality
26. They decided to celebrate by going out and ____.
A) getting on cloud nine
B) seeing the light at the end of the tunnel
C) painting the town red
D) getting over the moon
27. Oh no! It looks like the rain has ____ for the day.
A) broken out
B) brought on
C) set in
D) taken on
28. Don’t worry! I know the speech ____.
A) on the tip of my tongue
B) by heart
C) on my mind
D) off my head
Answer Key:
1: C
2: B
3: D
4: B
5: A
6: C
7: D
8: B
9: C
10: B
11: C
12: B
13: D
14: C
15: B
16: B
17: C
18: D
19: A
20: C
21: C
22: D
23: D
24: A
25: C
26: C
27: C
28: B
`;

function parseTest(rawText: string, levelName: string) {
  const lines = rawText.split('\n').map(l => l.trim()).filter(l => l !== '');
  const questions: Record<string, any> = {};
  const answers: Record<string, string> = {};

  let currentId: string | null = null;
  let inAnswers = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line === 'Answer Key:') {
      inAnswers = true;
      continue;
    }
    
    if (inAnswers) {
      if (line.match(/^\d+:\s*[A-D]/)) {
        const [qNum, ans] = line.split(':').map(l => l.trim());
        answers[qNum] = ans;
      }
    } else {
      const qMatch = line.match(/^(\d+)\.\s+(.*)/);
      if (qMatch) {
         currentId = qMatch[1];
         let qText = qMatch[2];
         while (i + 1 < lines.length && !lines[i+1].match(/^[A-D]\)/) && !lines[i+1].match(/^\d+\.\s+/)) {
           qText += " " + lines[i+1];
           i++;
         }
         questions[currentId] = { question: qText, options: [] };
      } else if (currentId && line.match(/^[A-D]\)\s+(.*)/)) {
         const m = line.match(/^[A-D]\)\s+(.*)/);
         if (m) questions[currentId].options.push(m[1].trim());
      }
    }
  }

  const result = [];
  for (const qNum of Object.keys(questions)) {
    const qObj = questions[qNum];
    if (qObj.options.length === 4 && answers[qNum]) {
      const correctIdx = ['A', 'B', 'C', 'D'].indexOf(answers[qNum]);
      const correctOptionText = qObj.options[correctIdx];
      result.push({
        id: levelName + "_" + qNum,
        type: 'MULTIPLE_CHOICE',
        question: qObj.question,
        options: qObj.options,
        correctAnswer: correctOptionText
      });
    }
  }
  return result;
}

const allLevels = [
  { name: 'Level 1: Elementary 1A', id: '1A', questions: parseTest(raw1A, '1A') },
  { name: 'Level 2: Elementary 1B', id: '1B', questions: parseTest(raw1B, '1B') },
  { name: 'Level 3: Pre-Intermediate 2A', id: '2A', questions: parseTest(raw2A, '2A') },
  { name: 'Level 4: Upper-Intermediate B2', id: 'B2', questions: parseTest(rawB2, 'B2') },
  { name: 'Level 5: Advanced C1', id: 'C1', questions: parseTest(rawC1, 'C1') },
  { name: 'Level 6: Proficiency C2 (Test 1)', id: 'C2T1', questions: parseTest(rawC2Test1, 'C2_1') },
  { name: 'Level 7: Proficiency C2 (Test 2)', id: 'C2T2', questions: parseTest(rawC2Test2, 'C2_2') },
];

fs.writeFileSync('src/data/levels.json', JSON.stringify(allLevels, null, 2));

console.log("Parsed levels! Total levels:", allLevels.length);
