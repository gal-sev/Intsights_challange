# Heroku deploy

## First deploy
1. Build
```
npm run deploy
```

2. Open `"./deploy"` folder

3. Init git repo:
```
git init
```

4. Login to heroku: (In case you didn't do it earlier)
```
heroku login
```

5. Create heroku project: (In case you didn't do it earlier)
```
heroku create <project-name>
```

6. Create heroku remote: (Replace `<project-name>` with name of your project)
```
heroku git:remote -a <project-name>
```

7. Commit last changes: (Replace `"My new commit"` with your message)
```
git add -A
git commit -m "My new commit"
```

8. Push changes:
```
git push heroku master -f
```

## Next deploys:
1. Build
```
npm run deploy
```
2. Open `"./deploy"` folder
3. Commit last changes: (Replace `"My new commit"` with your message)
```
git add -A
git commit -m "My new commit"
```
4. Push changes:
```
git push heroku master
```
