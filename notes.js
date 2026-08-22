// Add, remove, or edit notes here. Each note gets its own article route.
const notes = [
  {
    slug: "note-1",
    name: "right isn't always right",
    metadata: {
      published: "2026-08-21 2134",
      author: "Alejandro",
    },
    markdown: `
    Something I learned in my first two years as guidance, navigation and controls
    engineer is that doing things the right way ins't always the right idea.

    See, I like to be a perfectionist, and I've always been a firm believer of the mantra "Do
    it right the first time." Back in grad school, if I was given an action item,
    I'd often spend too much time trying to figure out the best possible way to get it
    done. In a research lab, where I had routine follow-ups with my advisor, that
    approach worked pretty well. 
    
    Maybe it's something about academia, where your work does not directly impact the work
    of others as often, but I've learned that trying to do things the "right" way every
    single time doesn't translate particularly well to industry.

    Why? 

    Because in industry, you're almost never given enough time to do everything exactly 
    the way you want to. That probably goes without saying, but the problem
    is compounded by the fact that nearly every engineer wants to be a perfectionist.
    Sure, none of use want to create tech debt for others or end up in some terrifying 
    meeting with our manager explaining why a tool broke in production. But that's not
    really the point I'm getting at.

    The bigger lesson for me has been learning the value of _**direction**_.

    Every project has a tech lead, and I've worked on plenty projects where I felt like
    I was bugging the absolute hell out of mine asking how I should approach X or Y. But 
    the truth is, doing that saves time.. a lof of it.
    
    Instead of spending hours debugging a tool that, as it turns out, was never even
    necessary for the analysis, I could get five minutes of direction from someone 
    who understood the bigger picture and immediately know what I needed to do next. 

    And that word.. "direction".. is surprisingly underappreciated.

    I think part of the reason is that asking for direction can feel like admitting you
    don't know what you're doing. Sometimes it feels like you should already know the answer,
    or that if you have to ask too many questions, maybe the task should have been given
    to someone else.

    I've struggled with that quite a bit. But unless you ask for help, you can stay stuck for
    hours, or days, without even realizing that you're solving the wrong problem.

    This brings me back to doing things the "right" way. If you're given a week to complete
    something, you don't necessarily spend the entire week perfecting it. Get something working
    in a day or two. Show it to your lead. Ask for direction. This is also great because it
    gives your lead visibility into your work and helps them help you better.

    Just because you have a week doesn't mean you should spend the remaining five days making
    your plots perfect, cleaning up every edge case, or building the most elegant
    implementation you can think of. Because if your lead looks at it at the end of the week
    and says "This isn't actually what we need", you didn't spend a week doing something the
    right way.

    You just wasted a week.

    Recently, I've had to deal with this lesson a lot. Between pressure from tech leads, 
    program, and constantly changing priorities, I've learned to deliver results much faster
    than I used to. A large part of that came from getting tired of spending so much time
    perfecting work that ultimately went unused.

    But there's also a huge upside. Delivering results quickly, even when the first version is
    a little quick and dirty, creates visibility. It gives peole something concrete to react to.
    And once people can see what you're doing, they can give you better direction. This is
    especially important when *your* work affects other key stakeholders.

    Yes, that usually leads to more work.. but that's actually a good thing.

    Because more work on the same problem usually means you've earned the opportunity to be a
    perfectionist.

    That tool you threw together in a few days might suddenly become part of a much larger
    investigation. Now there's a reason to clean it up. Now there's a reason to make it robust,
    improve the architecture, handle the edge cases, and turn it into something that other people
    can actually use.

    You didn't avoid doing things the right way.. you just waited until you knew what the right
    thing was. And, as least for me, that has become a much better definition of doing things right.
    `,
  },
];
