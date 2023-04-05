export let translateFirebaseCode = (code: string): string => {
  if (code === 'auth/invalid-email') return 'Bitte gib eine gültige Emailadresse an.'
  else if (code === 'auth/wrong-password') return 'Passwort falsch.'
  else if (code === 'auth/user-not-found') return 'Benutzer nicht gefunden.'
  else if (code === 'auth/too-many-requests') return 'Zu viele falsche Versuche. Bitte versuche es später erneut oder setze dein Passwort zurück.'
  else if (code === 'auth/weak-password') return 'Das Passwort muss mindestens 6 Zeichen lang sein.'
  else if (code === 'auth/email-already-in-use') return 'Mit dieser Email gibt es bereits ein Konto.'

  return code
}