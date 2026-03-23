ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user';
INSERT INTO users (full_name, email, password_hash, role)
VALUES ('Admin', 'admin@kori.com', '$2b$12$t2IuYkH1O/.3/8/X.4X85eN/.0x.I.x.Ww.f.b.X.X.N.Z.W.X.Z', 'admin')
ON CONFLICT (email) DO UPDATE SET role = 'admin';
