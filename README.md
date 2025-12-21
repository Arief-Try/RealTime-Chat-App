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
[PASTE YOUR 1000-WORD REPORT OR SUMMARY HERE]
* **Challenges:** Discuss the issues faced (e.g., configuring TypeScript types for Node.js `Buffer` and `NodeJS` namespaces, handling Supabase auth redirect loops).
* **Solutions:** How you fixed the `tsconfig.app.json` to include "node" types and set up the Supabase client.
* **Learning Outcome:** Understanding how backend-as-a-service works compared to traditional backends.

---

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
