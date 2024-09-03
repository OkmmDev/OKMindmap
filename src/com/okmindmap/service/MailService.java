package com.okmindmap.service;

import java.util.List;

public interface MailService {
	void sendMail(String to, String subject, String body);
	void sendMail(List<String> to, String subject, String body);
	void sendMail(String[] to, String subject, String body);
	void sendMail(String to, String subject, String body, String type);
	void sendMail(String[] to, String subject, String body, String type);
}
