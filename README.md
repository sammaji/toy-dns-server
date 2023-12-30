[![progress-banner](https://backend.codecrafters.io/progress/dns-server/e6b5142b-f443-47cb-8943-0ebe2b4a6a29)](https://app.codecrafters.io/users/codecrafters-bot?r=2qF)

This is a starting point for JavaScript solutions to the
["Build Your Own DNS server" Challenge](https://app.codecrafters.io/courses/dns-server/overview).

In this challenge, you'll build a DNS server that's capable of parsing and
creating DNS packets, responding to DNS queries, handling various record types
and doing recursive resolve. Along the way we'll learn about the DNS protocol,
DNS packet format, root servers, authoritative servers, forwarding servers,
various record types (A, AAAA, CNAME, etc) and more.

**Note**: If you're viewing this repo on GitHub, head over to
[codecrafters.io](https://codecrafters.io) to try the challenge.

# Passing the first stage

The entry point for your `your_server.sh` implementation is in `app/main.js`.
Study and uncomment the relevant code, and push your changes to pass the first
stage:

```sh
git add .
git commit -m "pass 1st stage" # any msg
git push origin master
```

Time to move on to the next stage!

# Stage 2 & beyond

Note: This section is for stages 2 and beyond.

1. Ensure you have `node (18)` installed locally
1. Run `./your_server.sh` to run your program, which is implemented in
   `app/main.js`.
1. Commit your changes and run `git push origin master` to submit your solution
   to CodeCrafters. Test output will be streamed to your terminal.
