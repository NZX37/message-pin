pip install PyGithub

from github import Github

g = Github("your_access_token")

user = g.get_user()

# Print all repositories of the authenticated user
for repo in user.get_repos():
print(repo.name)
num = int(input("Number to check: "))
flag = False
if num == 0 or num == 1:
    print(num, "is not a prime number")
elif num > 1:
    for i in range(2, num):
        if (num % i) == 0:
            flag = True
            break
    if flag:
        print(num, "is not a prime number")
    else:
        print(num, "is a prime number")
