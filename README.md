# Realtime Chat App with Angular & Supabase

## Student Details
* **Name:** ARIEF HAIDARIEY BIN AHMAD NASRI
* **Student ID:** 2024272526
* **Group:** T5CDCS2703B
* **Lecturer:** SIR MUHAMMAD ATIF RAMLAN

## Project Background
This project is a real-time chat application built using **Angular 17+** and **Supabase**. The goal was to understand modern web development practices, specifically:
* **Authentication:** Secure Google Sign-In using Supabase Auth.
* **State Management:** Using Angular Signals for reactive data updates.
* **Real-time Database:** Syncing chat messages across multiple clients instantly.
* **Security:** Implementing Row Level Security (RLS) to protect user data.
  

## Discussion (Lab Reflection)

**Main Functions**

* **Secure Authentication:** 
Integrated Google OAuth 2.0, delegating identity verification to Google and using JSON Web Tokens (JWT) for persistent sessions.

* **Reactive State Management:**
Implemented Angular Signals to handle reactive data flows, ensuring efficient UI re-renders without the overhead of manual subscription management.

* **Real-time Synchronization:**
Utilized WebSockets via Supabase Realtime to broadcast messages instantly across all connected clients.

* **Database-Level Security:** 
Configured Row Level Security (RLS) to protect data integrity, ensuring users can only manage their own profiles and messages.

* **Automated Backend Logic:** 
Developed PostgreSQL Functions and Triggers to automatically sync user profile metadata into public tables upon signup.


**Technical Challenges & Solutions**

* **TypeScript Configuration Issues:** 
I encountered errors regarding Node.js Buffer and NodeJS namespaces. This was resolved by modifying tsconfig.app.json to explicitly include "node" types in the compiler options, allowing the Supabase client to interact correctly with the Angular environment.

* **Authentication Redirect Loops:** 
I faced issues with redirect loops when setting up the Google OAuth callback. This was solved by precisely configuring the Authorized Redirect URIs in the Google Cloud Console and ensuring the Angular Route Guard correctly identified the session state before navigating.

* **Learning Outcomes**

* The most valuable learning outcomes is to have the basic understanding of the flow and the efficiency of the Backend-as-a-Service (BaaS). When being compared to to traditional backends where a developer must manually build APIs, manage server scaling, and write extensive boilerplate code for authentication, Supabase allowed me to focus on frontend logic while providing robust, "out-of-the-box" security and real-time features.


---
## Installation & Setup

* Clone the repository: git clone
* Install dependencies: npm install
* Configure environment.ts with your Supabase URL and Anon Key.
* Run the app: ng serve

## Technical Documentation & Database Setup

To run this project locally, you must set up your Supabase database with the following schema.

### 1. Users Table
This table stores user profiles linked to the Supabase Auth system.

<!-- ## Database Table Schema -->
## users table

* id (uuid)
* full_name (text)
* avatar_url (text)

## Creating a users table

```sql
CREATE TABLE public.users (
   id uuid not null references auth.users on delete cascade,
   full_name text NULL,
   avatar_url text NULL,
   primary key (id)
);
```

## Enable Row Level Security

```sql
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
```

## Permit Users Access Their Profile

```sql
CREATE POLICY "Permit Users to Access Their Profile"
  ON public.users
  FOR SELECT
  USING ( auth.uid() = id );
```

## Permit Users to Update Their Profile

```sql
CREATE POLICY "Permit Users to Update Their Profile"
  ON public.users
  FOR UPDATE
  USING ( auth.uid() = id );
```

## Supabase Functions

```sql
CREATE
OR REPLACE FUNCTION public.user_profile() RETURNS TRIGGER AS $$ BEGIN INSERT INTO public.users (id, full_name,avatar_url)
VALUES
  (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name'::TEXT,
    NEW.raw_user_meta_data ->> 'avatar_url'::TEXT,
  );
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Supabase Trigger

```sql
  CREATE TRIGGER
  create_user_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE
    public.user_profile();
```

## Chat_Messages table (Real Time)

* id (uuid)
* Created At (date)
* text (text)
* editable (boolean)
* sender (uuid)
