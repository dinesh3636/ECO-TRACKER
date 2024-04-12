MAX = 100001
prime = [True] * MAX
spf = list(range(MAX))

def sieve():
    global prime, spf
    for i in range(2, int(MAX**0.5)+1):
        if prime[i]:
            for j in range(i*i, MAX, i):
                if prime[j]:
                    spf[j] = i
                prime[j] = False

sieve()
print(spf)