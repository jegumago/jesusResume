# Jesús Martínez // DevOps & Admin Portfolio

This repository contains the source code for my professional portfolio, deployed via GitHub Pages. It is designed as a minimalist, terminal-style interface to showcase my experience, skills, and technical focus areas.

## Project Overview
This page functions as an interactive technical deck. It includes:
* **System Metrics:** Real-time (simulated) operational performance indicators.
* **Hardware Inventory:** A categorized breakdown of my technical skills (Jira, Linux, Automation, IAM, Cloud, etc.).
* **Contract Log:** An encrypted-style timeline of my professional experience that decrypts on interaction.
* **Adaptive Interface:** Ability to toggle between a "Cyber/Terminal" theme and a "Standard HR/Corporate" layout.

## Deployment Information
* **Live URL:** https://jegumago.github.io/jesusResume/
* **Hosting:** GitHub Pages
* **Branch:** `master`

## Maintenance Workflow
Whenever I update my portfolio (skills, projects, or metrics), use the following terminal workflow to deploy changes:

1. **Navigate to project folder:**
   cd ~/xx/xxxCV1


   ### Final Steps to Save & Push
Once you have created that file:

1. **Save it** in your `~/xx/xxxCV1` directory.
2. Run your new standard deployment command:

   cd ~/xx/xxxCV1
   git add .
   git commit -m ""
   git push origin master


I created the shipit function (among some other cool stuff) to avoid doing this add, commit and push located in my .bash_aliases file. Check it out. 
